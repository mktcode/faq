# Solohost

## Stack

- [Nuxt 3](https://nuxt.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MySQL](https://www.mysql.com/)
- [Hetzner Cloud](https://www.hetzner.com/cloud)
- [InterNetX AutoDNS](https://www.internetx.com/autodns/)
- [Qboxmail](https://www.qboxmail.com/)

## Local Setup

### Install Node/NPM

You need node 23 and npm.

Install NVM: https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Restart terminal and then:

```sh
nvm install 23
node -v # v23.11.1
npm -v # 10.9.2
```

### Clone Repo and install dependencies

```sh
git clone https://github.com/mktcode/solohost
cd solohost
npm i
```

### HTTPS

To make passkeys and other things work locally you need to configure a .local domain and create self-signed certificates for https.

Add entries to your hosts file for:
- solohost.local
- demo.solohost.local

```sh
sudo vim /etc/hosts
```

```sh
127.0.0.1       solohost.local
127.0.0.1       demo.solohost.local
```

#### Certificates

On Debian:

```
sudo apt install libnss3-tools mkcert
mkcert -install
```

Then in the project directory:

```
mkdir .localcert
mkcert -key-file .localcert/solohost.local+1-key.pem \
  -cert-file .localcert/solohost.local+1.pem \
  solohost.local "*.solohost.local"
```

Or see: https://mkcert.dev