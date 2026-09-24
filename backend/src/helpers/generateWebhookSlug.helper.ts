import { nanoid } from 'nanoid';

export const generateWebhookSlug = (length = 10) => {
  return nanoid(length);
};

export const buildWebhookUrl = (slug: string) => {
  return `${process.env.BASE_URL}/hooks/${slug}`;
};
