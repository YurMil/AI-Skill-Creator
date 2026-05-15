import { CatalogSkill, KnowledgeArticle } from '../types';

export const loadCatalog = async () => {
  const response = await fetch('/data/catalog.json');
  if (!response.ok) throw new Error(`Failed to load catalog: ${response.status}`);
  const data = await response.json();
  return (data.skills || []) as CatalogSkill[];
};

export const loadKnowledgeArticles = async () => {
  const response = await fetch('/data/kb/articles.json');
  if (!response.ok) throw new Error(`Failed to load knowledge base: ${response.status}`);
  const data = await response.json();
  return (data.articles || []) as KnowledgeArticle[];
};
