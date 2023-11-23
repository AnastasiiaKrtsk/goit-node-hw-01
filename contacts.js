const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve("db", "contacts.json");
const detectEncoding = require("detect-file-encoding-and-language");
const { nanoid } = require("nanoid");

// TODO: document each function
//*getALL
async function listContacts() {
  try {
    const { encoding } = await detectEncoding(contactsPath);
    const data = await fs.readFile(contactsPath, encoding);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}
//*byID
async function getContactById(id) {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === id) || null;
  } catch (error) {
    return null;
  }
}
//*remove
async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (contactIndex === -1) return null;

    const [removedContact] = contacts.splice(contactIndex, 1);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return removedContact;
  } catch (error) {
    return null;
  }
}

//*add
async function addContact(data) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...data,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
