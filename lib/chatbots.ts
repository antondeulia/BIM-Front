export interface DataSource {
  id: string;
  name: string;
  type: "text" | "media" | "file" | "dataset" | "data-source";
}

export interface ChatBot {
  id: number;
  name: string;
  desc: string;
  provider: string;
  model: string;
  temperature: number;
}
