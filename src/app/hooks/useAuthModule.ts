// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { axiosClient } from "@/lib/axiosClient";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";

// import Cookie from "js-cookie";
// import { jwtDecode } from "jwt-decode";

// export const useAuthModule = () => {
//   const router = useRouter();
//   const login = async (payload: any): Promise<any> => {
//     return await axiosClient
//       .post("/auth/login", payload)
//       .then((res) => res.data);
//   };

//   const verify = async (payload: any): Promise<any> => {
//     return await axiosClient
//       .post("/auth/verify", payload)
//       .then((res) => res.data);
//   };

//   const register = async (payload: any): Promise<any> => {
//     return await axiosClient
//       .post("/auth/register", payload)
//       .then((res) => res.data);
//   };

//   const getAdmins = async () => {
//     return await axiosClient.get("/user/admin", {
//       headers: {
//         Authorization: `Bearer ${Cookie.get("token") || ""}`
//       }
//     }).then((res) => res.data);
//   };

//   const getProfile = async () => {

//     const decode:any = jwtDecode(Cookie.get("token")!)
//     return await axiosClient.get(`/user/profile/${decode.id}`, {
//       headers: {
//         Authorization: `Bearer ${Cookie.get("token") || ""}`
//       }
//     }).then((res) => res.data);
//   }

//   const getMember = async () => {
//     return await axiosClient.get("/user/list/member", {
//       headers: {
//         Authorization: `Bearer ${Cookie.get("token")}`
//       }
//     }).then((res) => res.data)
//   }

//   const useLogin = () => {
//     const mutate = useMutation({
//       mutationFn: (payload: any) => login(payload as any),
//       onSuccess: (data) => {
//         console.log("Login successful", data);

//         Cookie.set("token", data.accessToken);

//         if (data.user.role === "MEMBER") {
//           router.push("/member");
//         }
//         if (data.user.role === "ADMIN") {
//           router.push("/admin");
//         }
//         if (data.user.role === "USER") {
//           router.push("/user");
//         }
//       },
//     });
//     return mutate;
//   };

//   const useVerify = () => {
//     const mutate = useMutation({
//       mutationFn: (payload: any) => verify(payload as any),
//       onSuccess: (data) => {
//         console.log("Verify successful", data);
//       },
//     });
//     return mutate;
//   };

//   const useRegister = () => {
//     const mutate = useMutation({
//       mutationFn: (payload: any) => register(payload as any),
//       onSuccess: (data) => {
//         const otp = data.otp;

//         if (otp) {
//           alert(`Your OTP is: ${otp}`);
//           router.push(`/auth/verify?email=${data.email}`);
//         }
//         console.log("Register successful", data);
//       },
//       onError: (error) => {
//         console.log("Register failed", error);
//       },
//     });
//     return mutate;
//   };

//   const useLogout = () => {
//     Cookie.remove("token");
//     router.push("/auth/login");
//   };

//   const useAdmins = () => {
//     const { data, isLoading } = useQuery({
//       queryFn: getAdmins,
//       queryKey: ["/admin"],
//       select: data => data
//     })

//     return { data, isLoading }
//   }


//   const useMember = () => {
//     const { data, isLoading } = useQuery({
//       queryFn: getMember,
//       queryKey: ["/member"],
//       select: data => data
//     })

//     return { data, isLoading }
//   }

//   const useProfile = () => {
//     const { data, isLoading } = useQuery({
//       queryFn: getProfile,
//       queryKey: ["/user"]
//     })

//     return { data, isLoading }
//   }

//   return { useLogin, useRegister, useVerify, useLogout, useAdmins, useMember, useProfile };
// };
