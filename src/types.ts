export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string; // The markdown content
}

export interface ConfiguredSkill extends Skill {
  cartId: string; // Unique ID for cart instance
}
