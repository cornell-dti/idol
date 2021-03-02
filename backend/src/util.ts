// This file contains common operations that will need to be performed often.

import { firestore } from 'firebase-admin';

/**
 * This function takes a collection reference and turns it into an array
 * of its constituent document references
 *
 * @param coll the collection to convert into a docref array
 */
export async function docRefArrayFromCollectionRef(
  coll: firestore.CollectionReference
): Promise<Array<any>> {
  // Init array
  const insArr: firestore.DocumentReference[] = [];
  // Go through each doc and add their reference
  return coll.get().then((snapshot) => {
    snapshot.forEach((element) => {
      insArr.push(element.ref);
    });
    return insArr;
  });
}

const maxDepthDefault = 5;

/**
 * This function takes in a JS struct, and recursively flattens out all the
 * references into their actual data values.
 *
 * Essentially, it converts all the references to their values so that the data
 * can be passed in json.
 *
 * @param object The object to materialize
 * @param depth The maximum depth of materialization (maxDepthDefault = 5)
 */
export async function materialize(
  object?: firestore.DocumentData,
  depth = maxDepthDefault
): Promise<any> {
  return new Promise((res, rej) => {
    if (depth <= 0) {
      res(object);
    }

    const objectStruct = { ...object };

    const propToProm: [string, Promise<any>][] = [];

    let foundAProp = false;

    for (const prop in objectStruct) {
      if (
        objectStruct[prop] &&
        Object.prototype.hasOwnProperty.call(objectStruct, prop)
      ) {
        if (isDocRef(objectStruct[prop])) {
          const ref = objectStruct[prop] as firestore.DocumentReference;
          const dataProm = ref
            .get()
            .then((val) => val.data())
            .then((data) => materialize(data, depth - 1));
          propToProm.push([prop, dataProm]);
          foundAProp = true;
        } else if (
          objectStruct[prop] instanceof Array &&
          objectStruct[prop].length > 0 &&
          isDocRef(objectStruct[prop][0])
        ) {
          const refArr = objectStruct[
            prop
          ] as Array<firestore.DocumentReference>;
          const groupProm: Promise<any>[] = [];
          for (let i = 0; i < refArr.length; i += 1) {
            const ref = refArr[i];
            const dataProm = ref
              .get()
              .then((valRet) => valRet.data())
              .then((data) => materialize(data, depth - 1));
            groupProm.push(dataProm);
          }
          propToProm.push([prop, Promise.all(groupProm)]);
          foundAProp = true;
        } else if (isCollRef(objectStruct[prop])) {
          const collection = objectStruct[
            prop
          ] as firestore.CollectionReference;
          const promRet = docRefArrayFromCollectionRef(
            collection
          ).then((colAsArr) => materialize(colAsArr, depth - 1));
          propToProm.push([prop, promRet]);
          foundAProp = true;
        }
      }
    }

    if (!foundAProp) {
      res(objectStruct);
    }

    const waitForThese: Promise<any>[] = propToProm.map(([k, v]) => v);

    return Promise.all(waitForThese).then((values) => {
      for (let i = 0; i < values.length; i += 1) {
        objectStruct[propToProm[i][0]] = values[i];
      }
      res(objectStruct);
    });
  });
}

function isDocRef(val: any) {
  return (
    typeof val.collection === 'function' &&
    typeof val.doc === 'undefined' &&
    typeof val.startAfter === 'undefined'
  );
}

function isCollRef(val: any) {
  return (
    typeof val.collection === 'undefined' &&
    typeof val.doc === 'function' &&
    typeof val.startAfter === 'function'
  );
}
