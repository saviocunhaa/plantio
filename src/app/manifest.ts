import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plantio Fácil",
    short_name: "Plantio",
    description: "Guia de plantio inteligente para iniciantes do zero até a colheita",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfbfa",
    theme_color: "#244227",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
