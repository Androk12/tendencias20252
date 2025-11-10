export const getProductImage = (nombreProducto = "") => {
  const name = nombreProducto.trim().toLowerCase();

  if (name.includes("huevo") || name.includes("huevos"))
    return "https://www.okchicas.com/wp-content/uploads/2016/12/Huevo.jpeg";

  if (name.includes("leche"))
    return "https://pacardylwpmedia.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/03/14175004/7702177022498.jpg";

  if (name.includes("pan"))
    return "https://lh3.googleusercontent.com/mYrXGS5f07kG_uHCHDmbm9_INS8dVPvEIxwzPdn8wX0crxFdkl32CJTu59aCbv1Yono-8BwKuo0nij4w6FOZl82cSuEsjH2pnqU=s360";

  if (name.includes("arroz"))
    return "https://jumbocolombiaio.vtexassets.com/arquivos/ids/186324/7702511000045.jpg?v=637813981861800000";

  if (name.includes("queso"))
    return "https://pacardylwpmedia.s3.us-east-2.amazonaws.com/wp-content/uploads/2021/10/04172630/7702129014083.jpg";

  if (name.includes("carne"))
    return "https://thumbs.dreamstime.com/b/peda%C3%A7o-e-bife-da-carne-vermelha-isolados-sobre-o-fundo-de-madeira-33490976.jpg";

  if (name.includes("pollo"))
    return "https://thumbs.dreamstime.com/b/pollo-crudo-30899329.jpg";

  return "https://cdn-icons-png.flaticon.com/512/2748/2748558.png"; // genérica
};
