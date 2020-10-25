module.exports = {
  siteMetadata: {
    description:
      "School IDForge is a simple online tool that generates an ID Card Barcode from a Student ID.",
    keywords:
      "school,id,forge,idforge,school idforge,student,student id,school id",
    version: "25.10.20",
    siteUrl: "https://schoolidforge.tk"
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `School IDForge`,
        short_name: `IDForge`,
        start_url: `/`,
        background_color: `#3298dc`,
        theme_color: `#3298dc`,
        display: `standalone`,
        icon: `src/assets/logo-512.png`,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/`, `/about/`, `/changelog/`],
      },
    },
  ],
};
