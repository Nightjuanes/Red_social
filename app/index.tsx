import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                padding: 20,
            }}
        >
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                Bienvenido a Conecti
            </Text>
            <View style={{ width: "100%", alignItems: "center" }}>
                <Link href={"/singin"} asChild>
                    <View style={{ width: "80%", marginBottom: 10 }}>
                        <Button
                            title="Enter"
                            color="#1E90FF"
                        />
                    </View>
                </Link>
                <Link href={"/signup"} asChild>
                    <View style={{ width: "80%" }}>
                        <Button
                            title="Register"
                            color="#1E90FF"
                        />
                    </View>
                </Link>
            </View>
        </View>
    );
}
