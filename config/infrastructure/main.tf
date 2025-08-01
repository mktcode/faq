terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }
}

variable "hcloud_token" {
  sensitive = true
}

data "hcloud_ssh_key" "default" {
  name = "kontakt@markus-kottlaender.de"
}

provider "hcloud" {
  token = var.hcloud_token
}

# Firewalls

resource "hcloud_firewall" "app" {
  name = "app"
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "22"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "80"
    source_ips = [hcloud_load_balancer.app.ipv4]
  }
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "443"
    source_ips = [hcloud_load_balancer.app.ipv4]
  }
}

resource "hcloud_firewall" "db" {
  name = "db"
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "22"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "3306"
    source_ips = [
      hcloud_server.app-1.ipv4_address,
    ]
  }
}

# Servers

resource "hcloud_server" "app-1" {
  name = "app-1"
  image = "ubuntu-24.04"
  server_type = "cax11"
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
  location = "fsn1"
  ssh_keys = [
    data.hcloud_ssh_key.default.id
  ]
  user_data = file("${path.module}/init.app.yml")
  firewall_ids = [ hcloud_firewall.app.id ]
}

resource "hcloud_server" "db" {
  name = "db"
  image = "ubuntu-24.04"
  server_type = "cax11"
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
  location = "nbg1"
  ssh_keys = [
    data.hcloud_ssh_key.default.id
  ]
  user_data = file("${path.module}/init.db.yml")
  firewall_ids = [ hcloud_firewall.db.id ]
}

# Load Balancer

resource "hcloud_load_balancer" "app" {
  name               = "app"
  load_balancer_type = "lb11"
  location           = "nbg1"
}

resource "hcloud_load_balancer_target" "app-1" {
  type             = "server"
  load_balancer_id = hcloud_load_balancer.app.id
  server_id        = hcloud_server.app-1.id
}

resource "hcloud_managed_certificate" "app" {
  name = "app"
  domain_names = ["solihost.de", "*.solihost.de"]
}

resource "hcloud_load_balancer_service" "app-health" {
  load_balancer_id = hcloud_load_balancer.app.id
  protocol         = "https"

  http {
    redirect_http = true
    certificates = [hcloud_managed_certificate.app.id]
  }

  health_check {
    protocol = "http"
    port     = 80
    interval = 30
    timeout  = 5
    retries = 5

    http {
      path         = "/up"
      tls          = false
      status_codes = ["200"]
    }
  }
}

# Outputs

output "app-1_ip" {
  value = hcloud_server.app-1.ipv4_address
}

output "db_ip" {
  value = hcloud_server.db.ipv4_address
}

output "app_lb_ip" {
  value = hcloud_load_balancer.app.ipv4
}