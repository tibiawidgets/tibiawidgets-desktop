import { MongoClient, ObjectId } from 'mongodb';

class MongoDB {
  constructor(url, dbName, collectionName) {
    this.url = url;
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.client = null;
    this.db = null;
    this.collection = null;
  }

  async connect() {
    this.client = await MongoClient.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.client.db(this.dbName);
    this.collection = this.db.collection(this.collectionName);
  }

  async insertOne(data) {
    const result = await this.collection.insertOne(data);
    return result.ops[0];
  }

  async findOneById(id) {
    const result = await this.collection.findOne({ _id: id });
    console.log(result);
    return result;
  }

  async updateOneById(id, data) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    return result.modifiedCount > 0;
  }

  async deleteOneById(id) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async disconnect() {
    await this.client.close();
  }

  async getAllHuntSessionsByUserId(userId) {
    const usersCollection = this.db.collection('users');
    const charactersCollection = this.db.collection('characters');
    const huntSessionsCollection = this.db.collection('hunt_sessions');

    const characters = await charactersCollection
      .find({ user_id: userId })
      .toArray();

    const pipeline = [
      {
        $lookup: {
          from: 'characters',
          localField: '_id',
          foreignField: 'user_id',
          as: 'characters',
        },
      },
      {
        $unwind: '$characters',
      },
      {
        $lookup: {
          from: 'hunt_sessions',
          localField: 'characters._id',
          foreignField: 'character_id',
          as: 'hunt_sessions',
        },
      },
      {
        $group: {
          _id: {
            user_id: '$_id',
            character_id: '$characters._id',
          },
          user: { $first: '$_id' },
          character: { $first: '$characters' },
          hunt_sessions: { $push: '$hunt_sessions' },
        },
      },
      {
        $group: {
          _id: '$user._id',
          user: { $first: '$user' },
          characters: {
            $push: {
              character: '$character',
              hunt_sessions: '$hunt_sessions',
            },
          },
        },
      },
    ];

    const cursor = await huntSessionsCollection.aggregate(pipeline);
    const result = await cursor.toArray();
    const data = {};
    result.forEach((userSessions) => {
      userSessions.characters.forEach((char) =>
        console.log(char.character.name)
      );
      // eslint-disable-next-line @typescript-eslint/dot-notation
      data[userSessions['_id']] = userSessions;
    });

    return data;
  }
}

export default MongoDB;
