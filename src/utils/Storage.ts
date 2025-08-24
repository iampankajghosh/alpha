import * as SecureStore from "expo-secure-store";

/**
 * Storage Utility
 *
 * Wrapper around expo-secure-store for simplified and encrypted key-value storage.
 * Handles serialization and deserialization of complex objects.
 * All methods are asynchronous for better performance and compatibility.
 */
class Storage {
  /**
   * Saves a value to SecureStore
   * @param key - Storage key
   * @param value - Value to store (object, array, string, etc.)
   */
  async set(key: string, value: unknown): Promise<void> {
    const serializedValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, serializedValue);
  }

  /**
   * Retrieves a valued value from SecureStore
   * @param key - Storage key
   * @returns Parsed value or null if not found
   */
  async get(key: string): Promise<unknown> {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Removes a value from SecureStore by key
   * @param key - Storage key to delete
   */
  async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }
}

// Export a singleton instance of Storage
export default new Storage();
