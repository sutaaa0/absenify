import { Alert } from "react-native";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.suta.absenify",
  projectId: "661dd4d2cd7a898178a1",
  databaseId: "661dd724629499e1d590",
  userCollectionId: "661dd78f9c5c380c9910",
  absensiId: "66238c2366a27b5f3543",
  statusUserId: "6627f06c28cc97aadb12",
};

const { endpoint, statusUserId, absensiId, platform, projectId, databaseId, userCollectionId, videoCollectionId, storageId } = appwriteConfig;

// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), {
      accountId: newAccount.$id,

      email,
      username,
      avatar: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal("accountId", currentAccount.$id)]);

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};
export const getAllUser = async () => {
  try {
    const users = await databases.listDocuments(databaseId, userCollectionId, [Query.orderDesc("$createdAt")]);

    return users.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUserByStatus = async (status) => {
  try {
    const users = await databases.listDocuments(databaseId, userCollectionId, [Query.equal("Status", status), Query.orderDesc("$createdAt")]);

    return users.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, absensiId, [Query.orderDesc("$createdAt")]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchAbsen = async (query) => {
  try {
    const dataAbsen = await databases.listDocuments(databaseId, absensiId, [Query.search("name", query)]);

    return dataAbsen.documents;
  } catch (error) {
    throw new Error(error);
  }
};
export const getUserAbsen = async (userId) => {
  try {
    const dataAbsen = await databases.listDocuments(databaseId, absensiId, [Query.equal("userAbsen", userId), Query.orderDesc("$createdAt")]);
    return dataAbsen.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getStatusUser = async (userId) => {
  try {
    // Mengambil dokumen pengguna berdasarkan ID pengguna
    const userDoc = await databases.getDocument(databaseId, userCollectionId, userId);

    // Jika dokumen pengguna ditemukan
    if (userDoc) {
      // Mengambil nilai status dari dokumen pengguna
      const status = userDoc.Status; // Sesuaikan dengan field yang menyimpan status

      return status;
    } else {
      // Jika dokumen pengguna tidak ditemukan
      return null;
    }
  } catch (error) {
    throw Error(error);
  }
};

export const getAbsenByDay = async (day) => {
  try {
    const dataAbsen = await databases.listDocuments(databaseId, absensiId, [
      Query.equal("hari", day), // Memfilter berdasarkan hari
      Query.orderDesc("$createdAt"), // Mengurutkan hasil berdasarkan tanggal pembuatan
    ]);
    return dataAbsen.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw Error(error);
  }
};

export const absen = async (user, waktu, keterangan, hari) => {
  try {
    const newAbsen = await databases.createDocument(databaseId, absensiId, ID.unique(), {
      waktuabsen: waktu,
      name: user.username,
      keterangan,
      userAbsen: user.$id,
      hari: hari,
    });

    console.log("Absen : ", newAbsen);
    console.log("Absen berhasil");
    Alert.alert("Absen Succes!");

    return newAbsen;
  } catch (error) {
    alert("Terjadi kesalahan saat melakukan absensi. Silakan coba lagi.");
    throw new Error(error);
  }
};

export const izin = async (form, user, waktu, totalIzin) => {
  try {
    const updateIzin = await databases.updateDocument(databaseId, userCollectionId, user.$id, {
      Status: form.category,
      Keterangan: form.description,
      totalIzin: totalIzin,
    });

    const newIzin = await databases.createDocument(databaseId, statusUserId, ID.unique(), {
      Status: form.category,
      Keterangan: form.description,
      name: user.username,
      userIzin: user.$id,
      waktuIzin: waktu,
    });

    return updateIzin, newIzin;
  } catch (error) {
    throw Error(error);
  }
};

export const getAllUserIzin = async (userId) => {
  try {
    const dataIzin = await databases.listDocuments(databaseId, statusUserId, [Query.equal("userIzin", userId), Query.orderDesc("$createdAt")]);
    return dataIzin.documents;
  } catch (error) {
    throw Error(error);
  }
};

export const getAllAbsen = async () => {
  try {
    const dataAbsen = await databases.listDocuments(databaseId, absensiId, [Query.orderDesc("$createdAt")]);

    return dataAbsen.documents;
  } catch (error) {
    console.log("error telah terjadi");
    throw new Error(error);
  }
};

export const getUserLatestAbsen = async (userId) => {
  try {
    // Menggunakan fungsi listDocuments dengan filter untuk ID pengguna dan pengurutan berdasarkan tanggal pembuatan
    const dataAbsen = await databases.listDocuments(databaseId, absensiId, [
      Query.equal("userAbsen", userId), // Filter berdasarkan ID pengguna
      Query.orderDesc("$createdAt"),
      Query.limit(1), // Mengurutkan berdasarkan tanggal pembuatan,
    ]);
    // Mengembalikan post terbaru dari pengguna tertentu
    return dataAbsen.documents;
  } catch (error) {
    console.log("data tidak ada");
    throw new Error(error);
  }
};

export const submitPermission = async (form, userId) => {
  console.log("user id: ", userId);
  try {
    const newIzin = await databases.updateDocument(databaseId, userCollectionId, userId, {
      Status: form.category,
      Keterangan: form.description,
    });

    return newIzin;
  } catch (error) {
    throw Error(error);
  }
};
export const akhiriIzin = async (userId) => {
  try {
    const newIzin = await databases.updateDocument(databaseId, userCollectionId, userId, {
      Status: "Kerja",
      Keterangan: "Sedang Kerja",
    });
    return newIzin;
  } catch (error) {
    throw Error(error);
  }
};

export const izinUser = async (totalIzin, userId) => {
  try {
    const newIzin = await databases.createDocument(databaseId, userCollectionId, userId, {
      Izin: totalIzin,
    });
    return newIzin;
  } catch (error) {
    throw Error(error);
  }
};
