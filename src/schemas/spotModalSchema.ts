import * as yup from "yup";

export const spotModalSchema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .max(33, "El nombre no puede exceder 33 caracteres"),
  direccion: yup
    .string()
    .notRequired()
    .max(25, "El enlace de dirección no puede exceder 25 caracteres"),
  link_direccion: yup
    .string()
    .notRequired()
    ,
  telefono: yup
    .string()
    .notRequired()
    .test("is-numeric", "El teléfono debe contener solo números", (value) => {
      if (!value) return true;
      return /^[0-9]*$/.test(value);
    })
    .max(25, "El teléfono no puede exceder 25 caracteres"),
  descripcion: yup
    .string()
    .notRequired()
    .max(160, "La descripción no puede exceder 160 caracteres"),
  instagram: yup.string().notRequired(),
  reservas: yup.string().notRequired(),
  menu: yup.string().notRequired(),
  delivery: yup.string().notRequired(),
  web: yup
    .string()
    .notRequired(),
});
