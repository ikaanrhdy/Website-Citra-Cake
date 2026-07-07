import { FirebaseError } from "firebase/app";

export const getFirebaseAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email atau password salah";
      case "auth/email-already-in-use":
        return "Email sudah terdaftar, silakan login";
      case "auth/weak-password":
        return "Password terlalu lemah, minimal 6 karakter";
      case "auth/invalid-email":
        return "Format email tidak valid";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan, coba lagi nanti";
      case "auth/network-request-failed":
        return "Koneksi bermasalah, periksa internet kamu";
      default:
        return "Terjadi kesalahan, silakan coba lagi";
    }
  }
  return "Terjadi kesalahan, silakan coba lagi";
};
