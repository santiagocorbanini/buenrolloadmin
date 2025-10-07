import { app } from "../lib/firebaseConfig/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import buenrolloLogo from "../assets/logo-sin-fondo.png";
import { loginSchema } from "@/schemas/loginSchema";
import Spinner from "./ui/Spinner";

const auth = getAuth(app);

interface AuthFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: AuthFormValues) => {
      return signInWithEmailAndPassword(auth, email, password);
    },
    onSuccess: () => {
      toast.success("Inicio de sesión exitoso");
    },
    onError: () => {
      toast.error("Credenciales inválidas");
    },
  });

  const onSubmit = (data: AuthFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Login</h1>
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
          <img
            className="max-w-full h-auto object-contain"
            src={buenrolloLogo}
            alt="Buen Rollo Logo"
            aria-label="Logo de Buen Rollo"
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-600 uppercase mb-1"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="Ingresar correo electrónico"
                {...register("email")}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-600 uppercase mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Ingresar contraseña"
                {...register("password")}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner />
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
