// import { useSignIn } from "@clerk/clerk-expo";
// import { Link, useRouter } from "expo-router";
// import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
// import React from "react";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { styles } from "../../assets/styles/auth.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { useState } from "react";
// import { colors } from "../../constants/color";

// export default function Page() {
//   const { signIn, setActive, isLoaded } = useSignIn();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   // Handle the submission of the sign-in form
//   const onSignInPress = async () => {
//     if (!isLoaded) return;

//     // Start the sign-in process using the email and password provided
//     try {
//       const signInAttempt = await signIn.create({
//         identifier: emailAddress,
//         password,
//         strategy: "password", // force password sign-in
//       });

//       // If sign-in process is complete, set the created session as active
//       // and redirect the user
//       if (signInAttempt.status === "complete") {
//         await setActive({ session: signInAttempt.createdSessionId });
//         router.replace("/");
//       } else {
//         // If the status isn't complete, check why. User might need to
//         // complete further steps.
//         console.error(JSON.stringify(signInAttempt, null, 2));
//       }
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2));
//       if (err.errors?.[0]?.code === "form_password_incorrect") {
//         setError("The password you entered is incorrect.");
//       } else {
//         setError("An unexpected error occurred. Please try again.");
//       }
//     }
//   };

//   return (
//     <KeyboardAwareScrollView
//       style={{ flex: 1 }}
//       contentContainerStyle={{ flexGrow: 1 }}
//       enableOnAndroid={true}
//       enableAutomaticScroll={true}
//       extraScrollHeight={50}
//     >
//       <View style={styles.container}>
//         <Image
//           source={require("../../assets/images/revenue-i4.png")}
//           style={styles.illustration}
//         />
//         <Text style={styles.title}>Welcome Back</Text>

//         {error ? (
//           <View style={styles.errorBox}>
//             <Ionicons name="alert-circle" size={20} color="red" />
//             <Text style={styles.errorText}>{error}</Text>
//             <TouchableOpacity onPress={() => setError("")}>
//               <Ionicons name="close" size={20} color="red" />
//             </TouchableOpacity>
//           </View>
//         ) : null}

//         <TextInput
//           style={[styles.input, error && styles.errorInput]}
//           autoCapitalize="none"
//           value={emailAddress}
//           placeholder="Enter email"
//           placeholderTextColor="#9AB478"
//           onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
//         />
//         <TextInput
//           style={[styles.input, error && styles.errorInput]}
//           value={password}
//           placeholder="Enter password"
//           secureTextEntry={false}
//           onChangeText={(password) => setPassword(password)}
//         />
//         <TouchableOpacity style={styles.button} onPress={onSignInPress}>
//           <Text style={styles.buttonText}>Sign In</Text>
//         </TouchableOpacity>
//         <View style={styles.footerContainer}>
//           <Text style={styles.footerText}>Don't have an account?</Text>
//           <Link href="/sign-up" asChild>
//             <TouchableOpacity>
//               <Text style={styles.linkText}>Sign up</Text>
//             </TouchableOpacity>
//           </Link>
//         </View>
//       </View>
//     </KeyboardAwareScrollView>
//   );
// }

import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/color";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [otpCode, setOtpCode] = useState(""); // for 2FA code
  const [needsSecondFactor, setNeedsSecondFactor] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      if (!needsSecondFactor) {
        // First factor: email + password
        const signInAttempt = await signIn.create({
          identifier: emailAddress,
          password,
        });

        if (signInAttempt.status === "complete") {
          await setActive({ session: signInAttempt.createdSessionId });
          router.replace("/");
        } else if (signInAttempt.status === "needs_second_factor") {
          // Require 2FA
          setNeedsSecondFactor(true);
          console.log("Second factor required:", signInAttempt);
        } else {
          console.error("Unexpected sign-in status:", signInAttempt.status);
          setError("Unexpected sign-in status. Check your credentials.");
        }
      } else {
        // Second factor: submit OTP/email code
        const verificationAttempt = await signIn.attemptSecondFactor({
          strategy: "email_code", // or "email_link" if you want
          code: otpCode,
        });

        if (verificationAttempt.status === "complete") {
          await setActive({ session: verificationAttempt.createdSessionId });
          router.replace("/");
        } else {
          setError("Invalid code. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Incorrect password.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={50}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i4.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        ) : null}

        {!needsSecondFactor ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </>
        ) : (
          <>
            <Text style={{ marginBottom: 10 }}>
              Enter the code sent to your email:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter code"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="numeric"
            />
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>
            {needsSecondFactor ? "Verify Code" : "Sign In"}
          </Text>
        </TouchableOpacity>

        {!needsSecondFactor && (
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}
