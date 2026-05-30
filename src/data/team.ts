export type Founder = {
  name: string;
  role: string;
  photo: string;
  bio: string;
  quote: string;
};

/** Los dos socios fundadores de MILO — copy aprobado por el cliente. */
export const FOUNDERS: Founder[] = [
  {
    name: "Michael Castro",
    role: "Socio fundador",
    photo: "/images/team/michael.jpg",
    bio: "Arquitecto por la Universidad Ricardo Palma. Casi diez años dando forma a proyectos de gran escala antes de fundar MILO. Obsesionado con la luz como material y con el detalle que no se ve pero se siente.",
    quote: "Una casa no se diseña, se afina hasta que respira.",
  },
  {
    name: "Jose Fernandez",
    role: "Socio fundador",
    photo: "/images/team/jose.jpg",
    bio: "Arquitecto por la Universidad Ricardo Palma. Una década entre obra y dirección de proyectos de envergadura. Cree que el buen diseño empieza por escuchar — al cliente, al terreno, al clima.",
    quote: "El lujo es que todo esté en su sitio y nadie sepa por qué.",
  },
];
