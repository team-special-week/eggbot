using HtmlAgilityPack;
using System.Reflection;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;
using System.Web;

namespace ParseDotnetDev
{
    public class Content
    {
        public string? title { get; set; }
        public string? content { get; set; }
        public string? contentID { get; set; }
        public string? thumbnailImageUrl { get; set; }
        public string? writerThumbnail { get; set; }
        public string? writerUsername { get; set; }
        public string? redirectUrl { get; set; }
        public DateTime writtenAt { get; set; }
    }
    internal class Program
    {
        static void Main(string[] args)
        {
            string html = "https://forum.dotnetdev.kr/c/dotnet-news/5";

            HtmlWeb web = new HtmlWeb();
            HtmlDocument htmlDoc = web.Load(html);

            HtmlNodeCollection tdNode = htmlDoc.DocumentNode.SelectNodes("//td");
            List<Content> contentList = new List<Content>();
            for(int i = 0; i < tdNode.Count/5; i++)
            {
                HtmlNode node = tdNode[i*5].SelectSingleNode(".//a");

                HtmlNode node1 = tdNode[i * 5 + 1].SelectSingleNode(".//a").SelectSingleNode(".//img");
                string decode = "";
                if (tdNode[i*5].InnerText.Contains("&amp"))
                {
                    decode = HttpUtility.HtmlDecode(tdNode[i*5].InnerText.Trim());
                }
                string text = $"{(string.IsNullOrWhiteSpace(decode) ? tdNode[i * 5].InnerText.Trim() : decode)}";
                if (node != null)
                {
                    text += "\n" + node.Attributes[1].Value.Trim();
                }
                if(node1 != null)
                {
                    text += "\n" + "https://forum.dotnetdev.kr" + node1.Attributes[2].Value.Trim();
                    text += "\n" + node1.Attributes[4].Value.Split(" - ")[0];
                }
                text += "\n" + tdNode[i * 5 + 4].InnerText.Trim();



                var contents = text.Split("\n");
                htmlDoc = web.Load(contents[1]);
                var content = htmlDoc.DocumentNode.SelectNodes("//div")[10].InnerText.Trim();
                var image = htmlDoc.DocumentNode.SelectNodes("//div")[10].SelectSingleNode(".//img");
                
                var contentID = string.Join("-",contents[1].Split("/")[3..]);
                var Contents = new Content()
                {
                    title = contents[0],
                    content = content,
                    contentID = contentID,
                    redirectUrl = contents[1],
                    thumbnailImageUrl = (image != null) ? image.Attributes["src"].Value : null,
                    writerThumbnail = contents[2],
                    writerUsername = contents[3],
                    writtenAt = DateTime.Parse(contents[4]
                    .Replace("월","/")
                    .Replace(",","/")
                    .Trim()),
                };
                

                contentList.Add(Contents);
            }
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.Create(UnicodeRanges.All, UnicodeRanges.Cyrillic),
                WriteIndented = true
            };
            string result = JsonSerializer.Serialize(contentList, options);
            Console.WriteLine(result);
        }
    }
}