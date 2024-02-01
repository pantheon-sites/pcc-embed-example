import Script from "next/script";
import useSWR from "swr";

export const SUPPORTED_PROVIDERS = [
  "Youtube",
  "Vimeo",
  "Twitter",
  "X",
  "Instagram",
  "DailyMotion",
];

export function getPreviewComponentFromURL(url: string) {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const hostnameParts = hostname.split(".");
  const provider = hostnameParts[hostnameParts.length - 2];

  switch (provider.toLowerCase()) {
    case "youtube":
    case "youtu":
    case "yt":
      return <YoutubePreview url={url} />;

    case "twitter":
    case "x":
      return <TwitterPreview url={url} />;

    case "vimeo":
      return <VimeoPreview url={url} />;
    case "instagram":
      return <InstagramPreview url={url} />;
    case "dailymotion":
      return <DailyMotionPreview url={url} />;
    default:
      return null;
  }
}

function VimeoPreview({ url }: { url: string }) {
  const getVimeoVideoId = (url: string) => {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const pathnameParts = pathname.split("/");
    return pathnameParts[pathnameParts.length - 1];
  };

  const embedUrl = `https://player.vimeo.com/video/${getVimeoVideoId(url)}`;

  return <iframe src={embedUrl} className="w-full max-w-[560px] h-80" />;
}

function DailyMotionPreview({ url }: { url: string }) {
  const getDailyMotionVideoId = (url: string) => {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const pathnameParts = pathname.split("/");
    return pathnameParts[pathnameParts.length - 1];
  };

  const embedUrl = `https://www.dailymotion.com/embed/video/${getDailyMotionVideoId(
    url
  )}`;

  return <iframe src={embedUrl} className="w-full max-w-[560px] h-96" />;
}

interface OEmbedResponse {
  html: string;
  width: number;
  thumbnail_width: number;
  thumbnail_height: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function YoutubePreview({ url }: { url: string }) {
  const { data, error, isLoading } = useSWR<OEmbedResponse>(
    `/api/utils/oembed?url=${encodeURIComponent(url)}&type=youtube`,
    fetcher
  );

  if (error) return <div>Error loading Youtube preview</div>;
  if (isLoading) return <div>Loading...</div>;

  // Set width of iframe to thumbnail width and height
  const html = data.html
    .replace(/width="(\d+)"/, `width="${data.thumbnail_width}"`)
    .replace(/height="(\d+)"/, `height="${data.thumbnail_height}"`);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function TwitterPreview({ url }: { url: string }) {
  // Replace X with Twitter
  const twitterURL = url.replace("x.com", "twitter.com");

  const { data, error, isLoading } = useSWR<OEmbedResponse>(
    `/api/utils/oembed?url=${encodeURIComponent(twitterURL)}&type=twitter`,
    fetcher
  );

  if (error) return <div>Error loading Twitter preview</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div
        style={{ maxWidth: data.width }}
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
      <Script src="https://platform.twitter.com/widgets.js" />
    </>
  );
}

function InstagramPreview({ url }: { url: string }) {
  const { data, error, isLoading } = useSWR<OEmbedResponse>(
    `/api/utils/oembed?url=${encodeURIComponent(url)}&type=instagram`,
    fetcher
  );

  if (error) return <div>Error loading Instagram preview</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div
        style={{ maxWidth: data.width }}
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
      <Script src="https://www.instagram.com/embed.js" />
    </>
  );
}
