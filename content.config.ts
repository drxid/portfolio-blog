import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Статьи — Markdown-страницы в content/articles/**
    articles: defineCollection({
      type: 'page',
      source: 'articles/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(), // ISO YYYY-MM-DD
        tags: z.array(z.string()).optional().default([]),
        draft: z.boolean().optional().default(false),
        cover: z.string().optional(),
      }),
    }),

    // Чеклист — структурированные данные из content/checklist/items.yml
    checklist: defineCollection({
      type: 'data',
      source: 'checklist/**',
      schema: z.object({
        items: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            text: z.string().optional(),
            link: z.string().optional(),
            tags: z.array(z.string()).optional().default([]),
            rating: z.number().min(0).max(10).optional(),
            done: z.boolean().optional().default(false),
            category: z.enum(['articles', 'books', 'videos', 'projects', 'other']),
            date: z.string(),
          }),
        ),
      }),
    }),
  },
})
