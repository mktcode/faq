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

### Database

You need a MySQL database, remote or local.

For local installation on Debian, including phpmyadmin:

```sh
sudo apt install apache2 php php-cgi php-mysqli php-pear php-mbstring libapache2-mod-php php-common php-phpseclib php-mysql mariadb-server -y
sudo systemctl start apache2 && sudo systemctl enable apache2
sudo systemctl start mariadb && sudo systemctl enable mariadb
sudo mariadb-secure-installation
```

Create database and user:

```sh
sudo mysql
```

```sh
CREATE USER 'YourUsername'@'localhost' IDENTIFIED BY 'YourStrongPassword';
GRANT ALL PRIVILEGES ON *.* TO 'YourUsername'@'localhost' WITH GRANT OPTION;
```

Phpmyadmin:

```sh
sudo apt install phpmyadmin # choose apache during installation
```

Now open http://localhost/phpmyadmin and create a database named "solohost".

### Environment Variables

```sh
cp .env.example .env.local
```

```sh
DATABASE_URL=mysql://<user>:<password>@localhost:3306/solohost
...
```

### Migrate Database

```sh
export DATABASE_URL=mysql://<user>:<password>@localhost:3306/solohost
npm run migrate
# migration "0_init" was executed successfully
```

### Done

You can now open https://solohost.local:3000

## Passkeys

To register and login locally on Linux you currently need a passkey manager like KeePassXC: https://keepassxc.org/

Install the browser extension too.