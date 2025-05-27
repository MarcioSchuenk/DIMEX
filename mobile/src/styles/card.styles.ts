import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#1B5E2040",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  iconContainer: {
    backgroundColor: "#4CAF50",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    color: "#212121",
    fontWeight: "600",
  },
  cardSubtext: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
});
