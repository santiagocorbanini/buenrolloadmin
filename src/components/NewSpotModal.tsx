import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import Spinner from "@/components/ui/Spinner";

import { useModal } from "@/hooks/useModal";
import { useCreateSpotMutation } from "@/services/useCreateSpotMutation";
import { SPOTS_KEY } from "@/const/queryKeys";

interface NewSpotModalProps {
  seccionId: number;
}

type SpotFormData = {
  nombre: string;
  direccion?: string;
  link_direccion?: string;
  telefono?: string;
  descripcion?: string;
  instagram?: string;
  reservas?: string;
  menu?: string;
  delivery?: string;
  web?: string;
  lugares_order?: number;
};

export default function NewSpotModal({ seccionId }: NewSpotModalProps) {
  const { close } = useModal();
  const queryClient = useQueryClient();
  const createSpotMutation = useCreateSpotMutation();

  const fileTypes = ["JPG", "JPEG", "PNG"];
  const [file, setFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpotFormData>({
    defaultValues: {
      nombre: "",
      direccion: "",
      link_direccion: "",
      telefono: "",
      descripcion: "",
      instagram: "",
      reservas: "",
      menu: "",
      delivery: "",
      web: "",
      lugares_order: 0,
    },
  });

  const handleChange = (uploadedFile: File | File[]) => {
    const singleFile = Array.isArray(uploadedFile)
      ? uploadedFile[0]
      : uploadedFile;

    if (singleFile.size > 1048576) {
      toast.error(
        "El archivo es demasiado grande. El tamaño máximo permitido es 1MB."
      );
      setLogoError("El archivo es demasiado grande");
      setFile(null);
    } else {
      setFile(singleFile);
      setLogoError("");
      toast.success("Imagen cargada correctamente");
    }
  };

  const onSubmit = async (data: SpotFormData) => {
    try {
      const formData = new FormData();

      formData.append("nombre", data.nombre);
      formData.append("seccion_id", seccionId.toString());

      if (data.direccion) formData.append("direccion", data.direccion);
      if (data.link_direccion)
        formData.append("link_direccion", data.link_direccion);
      if (data.telefono) formData.append("telefono", data.telefono);
      if (data.descripcion) formData.append("descripcion", data.descripcion);
      if (data.instagram) formData.append("instagram", data.instagram);
      if (data.reservas) formData.append("reservas", data.reservas);
      if (data.menu) formData.append("menu", data.menu);
      if (data.delivery) formData.append("delivery", data.delivery);
      if (data.web) formData.append("web", data.web);
      if (data.lugares_order) formData.append("lugares_order", data.lugares_order.toString());

      if (file) {
        formData.append("logo", file);
      }

      await createSpotMutation.mutateAsync(formData);

      toast.success(`Negocio ${data.nombre} creado exitosamente`);
      queryClient.invalidateQueries({ queryKey: [SPOTS_KEY] });
      close();
    } catch (error) {
      console.error("Error creating spot:", error);
      toast.error("Error al crear el spot");
    }
  };

  return (
    <div className="fixed inset-0 z-50 transition-all duration-300 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-300 opacity-100"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        style={{ zIndex: 1 }}
      >
        <aside
          className="absolute top-0 right-0 h-full w-full max-w-md bg-background shadow-lg z-50 transition-transform duration-300 pointer-events-auto translate-x-0"
          style={{ zIndex: 2 }}
        >
          <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
            <div className="bg-background px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Nuevo Comercio</h2>
              <X
                className="ml-4 font-bold cursor-pointer"
                onClick={close}
                aria-label="Cerrar"
              />
            </div>
            <div className="p-6 pt-4 max-w-full min-w-0 overflow-x-hidden flex-1">
              <form
                className="space-y-4 w-full max-w-full min-w-0"
                onSubmit={handleSubmit(onSubmit)}
                id="spot-form"
              >
                <FormInput
                  label="Nombre Del Comercio"
                  type="text"
                  register={register("nombre", {
                    required: "El nombre es requerido",
                    maxLength: {
                      value: 30,
                      message: "El nombre no puede exceder 30 caracteres",
                    },
                  })}
                  error={errors.nombre?.message}
                  placeholder="Ingrese el nombre del comercio"
                />

                <FormInput
                  label="Dirección"
                  type="text"
                  register={register("direccion")}
                  error={errors.direccion?.message}
                  placeholder="Ingrese la dirección"
                />

                <FormInput
                  label="Link de Google Maps de Dirección (Enlace)"
                  type="text"
                  register={register("link_direccion")}
                  error={errors.link_direccion?.message}
                  placeholder="Ingrese el enlace de la dirección"
                />

                <FormInput
                  label="Teléfono"
                  type="text"
                  register={register("telefono", {
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "El teléfono debe contener solo números",
                    },
                  })}
                  error={errors.telefono?.message}
                  placeholder="Ingrese el número de teléfono"
                />

                <div>
                  <label
                    htmlFor="logo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Logo
                  </label>
                  <div className="space-y-3">
                    <FileUploader
                      handleChange={handleChange}
                      name="logo"
                      types={fileTypes}
                      multiple={false}
                      label="Arrastre o suba una imagen"
                      hoverTitle="Arrastre aquí"
                    />
                    {file && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Archivo seleccionado: {file.name}
                        </p>
                        <div className="mt-2 relative w-full h-32 border rounded-md overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Vista previa"
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                    {logoError && (
                      <p className="mt-1 text-sm text-red-600">{logoError}</p>
                    )}
                  </div>
                </div>

                <FormInput
                  label="Descripción"
                  type="text"
                  register={register("descripcion", {
                    maxLength: {
                      value: 75,
                      message: "La descripción no puede exceder 75 caracteres",
                    },
                  })}
                  error={errors.descripcion?.message}
                  placeholder="Ingrese la descripción"
                />

                <FormInput
                  label="Instagram"
                  type="text"
                  register={register("instagram")}
                  error={errors.instagram?.message}
                  placeholder="usuario"
                  span="https://instagram.com/"
                />

                <FormInput
                  label="Reservas (Enlace)"
                  type="text"
                  register={register("reservas")}
                  error={errors.reservas?.message}
                  placeholder="Información de reservas"
                />

                <FormInput
                  label="Menú (Enlace)"
                  type="text"
                  register={register("menu")}
                  error={errors.menu?.message}
                  placeholder="Información del menú"
                />

                <FormInput
                  label="Delivery (Enlace)"
                  type="text"
                  register={register("delivery")}
                  error={errors.delivery?.message}
                  placeholder="Información de delivery"
                />

                <FormInput
                  label="Web (Enlace)"
                  type="text"
                  register={register("web", {
                    validate: (value) => {
                      if (!value) return true;
                      return true;
                    },
                  })}
                  error={errors.web?.message}
                  placeholder="Sitio web"
                />

                <FormInput
                    label="Orden de la sección"
                    type="number"
                    register={register("lugares_order", {
                        required: "El orden es obligatorio",
                        min: {
                        value: 0,
                        message: "Debe ser mayor o igual a 0",
                        },
                    })}
                    error={errors.lugares_order?.message}
                    placeholder="Ej: 1, 2, .. (mayor o igual a 0)"
                />             

                <div className="flex justify-end pt-2">
                  <Button
                    className="w-full mt-2"
                    type="submit"
                    disabled={createSpotMutation.isPending}
                  >
                    {createSpotMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="flex">
                          <Spinner />
                        </span>
                      </div>
                    ) : (
                      "Crear Comercio"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
