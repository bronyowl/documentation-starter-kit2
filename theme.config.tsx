import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <img
        src="https://cdn.jsdelivr.net/gh/bronyowl/typopicbed@main/img/RemiFumoLook.png"
        style={{
          height: '3em',
          width: '3em',
          objectFit: 'contain'
        }}
      />
      周熠琳女士专用EJU知识点梳理网站
    </span>
  ),
  project: {
    link: 'https://github.com/bronyowl/documentation-starter-kit2.git',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/bronyowl/documentation-starter-kit2.git',
  footer: {
    text: '两眼一睁，开始竞争；提高一分，干掉千人。',
  },
}

export default config
