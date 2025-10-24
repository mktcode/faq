import Handlebars from "handlebars";

export default defineEventHandler((event) => {
  const data = {
    title: 'FAQ Website',
    products: [
      { id: 1, name: 'Product A', price: 29.99 },
      { id: 2, name: 'Product B', price: 49.99 },
      { id: 3, name: 'Product C', price: 19.99 },
    ],
  }

  const partials = [
    {
      name: 'product-card',
      html: `<div class="product-card">
        <h3>{{this.name}}</h3>
        <p>Price: {{this.price}}</p>
      </div>`,
      css: `.product-card { border: 1px solid #ccc; padding: 16px; margin: 16px 0; }`,
      js: `console.log('Product Card loaded');`,
    }
  ]

  partials.forEach(partial => {
    Handlebars.registerPartial(partial.name, partial.html)
  })

  const sections = [
    {
      name: 'Welcome',
      html: `<h1>Welcome {{data.title}}</h1><p>Find answers to common questions about our products.</p>`,
      css: `h1 { color: #007acc; } p { font-size: 16px; }`,
      js: `console.log('Welcome section loaded');`,
    },
    {
      name: 'Products',
      html: `<h2>Our Products</h2>{{#each data.products}}{{>product-card product=.}}{{/each}}`,
      css: `h2 { color: #ff6600; } ul { list-style-type: square; }`,
      js: `console.log('Products section loaded');`,
    },
    {
      name: 'Contact',
      html: `<h2>Contact Us</h2><p>If you have any questions, feel free to reach out!</p>`,
      css: `h2 { color: #cc0000; } p { font-style: italic; }`,
      js: `console.log('Contact section loaded');`,
    },
  ]

  const globalCss = `body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; } h1 { color: #007acc; }`
  const globalJs = `console.log('FAQ Website Loaded');`

  const htmlHead = `<head><style>${globalCss}</style><script src="//unpkg.com/alpinejs" defer></script><script>${globalJs}</script></head>`

  const htmlBody = `<body>${sections.map(section => `
    <section>
      ${Handlebars.compile(section.html)({ data })}
      <style>${section.css}</style>
      <script>${section.js}</script>
    </section>
  `).join('')}</body>`

  const html = `<!DOCTYPE html><html>${htmlHead}${htmlBody}</html>`

  event.node.res.setHeader('Content-Type', 'text/html')
  event.node.res.end(html)
})
