import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

import { Collection } from '../models';

interface SwapDB extends DBSchema {
  userCollections: {
    key: string; // con la forma userId/collectionId
    value: {
      id: string; // con la forma userId/collectionId
      userId: string; // se guarda como string para poder buscar por index
      collectionId: string; // se guarda como string para poder buscar por index
      data: Collection; // Datos de la userCollection
      lastUpdated: string; // Fecha de última actualización
    };
    indexes: {
      'by-userId': string;
      'by-lastUpdated': string;
    };
  };
}

@Injectable()
export class OfflineService {
  private dbPromise: Promise<IDBPDatabase<SwapDB>>;

  constructor() {
    this.dbPromise = openDB<SwapDB>('swap-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('userCollections', {
          keyPath: 'id',
        });
        store.createIndex('by-userId', 'userId');
        store.createIndex('by-lastUpdated', 'lastUpdated');
      },
    });
  }

  // Método para asignar la clave compuesta de userId y collectionId
  private createCompositeKey(userId: number, collectionId: number): string {
    return `${userId}/${collectionId}`;
  }

  async getAllCollections(userId: number) {
    const db = await this.dbPromise;
    const tx = db.transaction('userCollections', 'readonly');
    const store = tx.objectStore('userCollections');
    const index = store.index('by-userId');

    return index.getAll(userId.toString());
  }

  async getCollection(userId: number, collectionId: number) {
    const db = await this.dbPromise;
    return db.get(
      'userCollections',
      this.createCompositeKey(userId, collectionId)
    );
  }

  async saveCollection(userCollection: {
    userId: number;
    collectionId: number;
    data: Collection;
    lastUpdated: string;
  }) {
    const db = await this.dbPromise;
    return db.put('userCollections', {
      ...userCollection,
      userId: userCollection.userId.toString(),
      collectionId: userCollection.collectionId.toString(),
      id: this.createCompositeKey(
        userCollection.userId,
        userCollection.collectionId
      ),
    });
  }

  async saveMultipleCollections(
    userCollections: {
      userId: number;
      collectionId: number;
      data: Collection;
      lastUpdated: string;
    }[]
  ) {
    const db = await this.dbPromise;
    const tx = db.transaction('userCollections', 'readwrite');
    const store = tx.objectStore('userCollections');

    try {
      for (const collection of userCollections) {
        await store.put({
          ...collection,
          userId: collection.userId.toString(),
          collectionId: collection.collectionId.toString(),
          id: this.createCompositeKey(
            collection.userId,
            collection.collectionId
          ),
        });
      }
      await tx.done;
    } catch (error) {
      console.error('Error al guardar las colecciones en IndexedDB', error);
      throw error;
    }
  }

  async deleteCollection(userId: number, collectionId: number) {
    const db = await this.dbPromise;
    return db.delete(
      'userCollections',
      this.createCompositeKey(userId, collectionId)
    );
  }

  async deleteMultipleCollection(userId: number, collectionsId: number[]) {
    const db = await this.dbPromise;
    const tx = db.transaction('userCollections', 'readwrite');
    const store = tx.objectStore('userCollections');

    try {
      for (const collectionId of collectionsId) {
        const key = `${userId}/${collectionId}`;
        await store.delete(key);
      }
      await tx.done;
      console.log('Colecciones eliminadas correctamente.');
    } catch (error) {
      console.error('Error al eliminar las colecciones:', error);
      throw error;
    }
  }

  async clearAllCollections(userId: number) {
    const db = await this.dbPromise;
    const tx = db.transaction('userCollections', 'readwrite');
    const store = tx.objectStore('userCollections');
    const index = store.index('by-userId');

    try {
      const keys = await index.getAllKeys(userId.toString());

      for (const key of keys) {
        await store.delete(key);
      }

      await tx.done;
    } catch (error) {
      console.error(
        `Error al eliminar las colecciones del usuario ${userId}`,
        error
      );
      throw error;
    }
  }
}
