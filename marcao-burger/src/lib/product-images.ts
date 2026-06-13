// Map product slug -> imported asset URL
import duploMarcao from "@/assets/product-duplo-marcao.jpg";
import marcaoPicante from "@/assets/product-marcao-picante.jpg";
import marcaoNervoso from "@/assets/product-marcao-nervoso.jpg";
import maranhense from "@/assets/product-maranhense.jpg";
import comboFamilia from "@/assets/product-combo-familia.jpg";
import milkshake from "@/assets/product-milkshake.jpg";
import heroBurger from "@/assets/hero-burger.jpg";

export const productImages: Record<string, string> = {
  "duplo-marcao": duploMarcao,
  "marcao-picante": marcaoPicante,
  "marcao-nervoso": marcaoNervoso,
  "classico-marcao": heroBurger,
  "maranhense-burger": maranhense,
  "cuxa-burger": maranhense,
  "burger-bumba": marcaoNervoso,
  "sao-luis-burger": duploMarcao,
  "combo-familia": comboFamilia,
  "combo-solo": comboFamilia,
  "milkshake-chocolate": milkshake,
  "milkshake-cupuacu": milkshake,
  "refri-350": milkshake,
  "suco-natural": milkshake,
};

export const getProductImage = (slug: string) => productImages[slug] ?? heroBurger;
