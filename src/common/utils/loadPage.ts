import axios from 'axios';
import cheerio from 'cheerio';

export default async function loadPage(url: string): Promise<cheerio.Root> {
  const response = await axios.get(url);
  if (response.status !== 200 || !response.data) {
    throw new Error(`${url} is not healthy.`);
  }

  return cheerio.load(response.data);
}
