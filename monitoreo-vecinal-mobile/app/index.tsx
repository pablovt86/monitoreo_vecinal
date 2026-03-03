import { Redirect } from "expo-router";

export default function Index() {
  // Por ahora mandamos directo a login
  return <Redirect href="/(auth)/login" />;
}
