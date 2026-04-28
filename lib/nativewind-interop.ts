import { cssInterop } from "react-native-css-interop";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

// Register third-party components for NativeWind className support
cssInterop(Image, { className: "style" });
cssInterop(LinearGradient, { className: "style" });
cssInterop(BlurView, { className: "style" });
