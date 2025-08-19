import z from 'zod'

const hetznerApiUrl = 'https://api.hetzner.cloud/v1'

export async function createCertificate(domain: string) {
  const { hetznerApiKey } = useRuntimeConfig()

  const resultSchema = z.object({
    certificate: z.object({
      id: z.number(),
    }),
  })
  type ResultType = z.infer<typeof resultSchema>

  const result = await $fetch<ResultType>(`${hetznerApiUrl}/certificates`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hetznerApiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      name: domain,
      type: 'managed',
      domain_names: [domain, `www.${domain}`],
    },
  })

  const validatedResult = resultSchema.parse(result)

  return validatedResult.certificate.id
}

export async function getLoadBalancer() {
  const { hetznerApiKey } = useRuntimeConfig()

  const resultSchema = z.object({
    load_balancers: z.array(z.object({
      id: z.number(),
      services: z.array(z.object({
        protocol: z.string(),
        listen_port: z.number(),
        destination_port: z.number(),
        proxyprotocol: z.boolean(),
        health_check: z.object({
          protocol: z.string(),
          port: z.number(),
          interval: z.number(),
          timeout: z.number(),
          retries: z.number(),
          http: z.object({
            domain: z.string(),
            path: z.string(),
            response: z.string(),
            status_codes: z.array(z.string()),
            tls: z.boolean(),
          }),
        }),
        http: z.object({
          cookie_name: z.string(),
          cookie_lifetime: z.number(),
          certificates: z.array(z.number()),
          redirect_http: z.boolean(),
          sticky_sessions: z.boolean(),
        }),
      })),
    })),
  })

  const result = await $fetch(`${hetznerApiUrl}/load_balancers`, {
    headers: {
      Authorization: `Bearer ${hetznerApiKey}`,
    },
  })

  const validatedResult = resultSchema.parse(result)

  return validatedResult.load_balancers[0]
}

export async function addNewCertToLoadBalancer(domain: string) {
  const { hetznerApiKey } = useRuntimeConfig()

  const newCertId = await createCertificate(domain)
  const loadBalancer = await getLoadBalancer()
  const currentService = loadBalancer.services[0]

  const resultSchema = z.object({
    action: z.object({
      id: z.number(),
      error: z.object({
        code: z.string(),
        message: z.string(),
      }).nullable(),
    }),
  })
  type ResultType = z.infer<typeof resultSchema>

  const result = await $fetch<ResultType>(`${hetznerApiUrl}/load_balancers/${loadBalancer.id}/actions/update_service`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hetznerApiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      protocol: currentService.protocol,
      listen_port: currentService.listen_port,
      destination_port: currentService.destination_port,
      proxyprotocol: currentService.proxyprotocol,
      health_check: {
        protocol: currentService.health_check.protocol,
        port: currentService.health_check.port,
        interval: currentService.health_check.interval,
        timeout: currentService.health_check.timeout,
        retries: currentService.health_check.retries,
        http: {
          domain: currentService.health_check.http.domain,
          path: currentService.health_check.http.path,
          response: currentService.health_check.http.response,
          status_codes: currentService.health_check.http.status_codes,
          tls: currentService.health_check.http.tls,
        },
      },
      http: {
        cookie_name: currentService.http.cookie_name,
        cookie_lifetime: currentService.http.cookie_lifetime,
        certificates: [...currentService.http.certificates, newCertId],
        redirect_http: currentService.http.redirect_http,
        sticky_sessions: currentService.http.sticky_sessions,
      },
    },
  })

  const validatedResult = resultSchema.parse(result)

  if (validatedResult.action.error) {
    throw new Error(`Failed to add certificate to load balancer: ${validatedResult.action.error.message}`)
  }

  return { success: true, action: validatedResult.action }
}
