module.exports = {
  siteMetadata: {
    description:
      "School IDForge is a simple online tool that generates an ID Card Barcode from a Student ID.",
    keywords:
      "school,id,forge,idforge,school idforge,student,student id,school id",
    version: "08.12.20",
    siteUrl: "https://schoolidforge.tk",
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
        background_color: `#2f3437`,
        theme_color: `#2f3437`,
        display: `standalone`,
        icon: `src/assets/logo-512.png`,
      },
    },
    `gatsby-plugin-offline`,
  ],
};
