# Mkt's CMS

This Project is a simple CMS (Content Management System) and Accounting System for small businesses, freelancers, and self-employed individuals.

## Stack

- [Nuxt 3](https://nuxt.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MySQL](https://www.mysql.com/)
- [Mailcow](https://mailcow.email/)
- [Hetzner Cloud](https://www.hetzner.com/cloud)

## Infrastructure

- Load Balancer
  - App Server 1
    - Firewall: only LB on port 80
  - App Server 2
    - Firewall: only LB on port 80
  - App Server ...
- S3 Bucket
  - Public
  - Private (Locked)
- Database Server
  - Firewall: only App Servers on port 3306
- Mail Server
  - Firewall: only App Servers on port 25