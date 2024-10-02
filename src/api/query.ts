import { drizzle } from "drizzle-orm/better-sqlite3";
import { faker } from "@faker-js/faker";
import Database from "better-sqlite3";
import { schema } from "../../drizzle/schema";
import { eq, or } from "drizzle-orm";
const sqlite = new Database("drizzle/db/db.sqlite");
const db = drizzle(sqlite, {
  schema: schema,
});
export class UserManager {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async createUser(userInfo?: { name?: string; email?: string }) {
    const user = {
      name: userInfo?.name || faker.person.fullName(),
      email: userInfo?.email || faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date(),
    };
    return await this.db
      .insert(schema.users)
      .values({
        name: user.name,
        email: user.email,
      })
      .returning()
      .execute();
  }

  async getUser(identifier: string | number) {
    if (typeof identifier === "number") {
      return await this.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, identifier));
    } else {
      return await this.db
        .select()
        .from(schema.users)
        .where(
          or(
            eq(schema.users.email, identifier),
            eq(schema.users.name, identifier),
          ),
        )
        .execute();
    }
  }

  async getAllUsersWithRatings(limit: number = 10, offset: number = 0) {
    const users = await this.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
      })
      .from(schema.users)
      .limit(limit)
      .offset(offset)
      .execute();

    const usersWithRatings = await Promise.all(
      users.map(async (user) => {
        const ratings = await this.db
          .select({
            id: schema.ratings.id,
            score: schema.ratings.score,
          })
          .from(schema.ratings)
          .where(eq(schema.ratings.userId, user.id))
          .execute();

        return {
          ...user,
          ratings,
        };
      }),
    );

    return usersWithRatings;
  }
  async updateUser(
    identifier: string | number,
    updateData: Partial<typeof schema.users.$inferInsert>,
  ) {
    if (typeof identifier === "number") {
      return await this.db
        .update(schema.users)
        .set(updateData)
        .where(eq(schema.users.id, identifier))
        .execute();
    } else {
      return await this.db
        .update(schema.users)
        .set(updateData)
        .where(
          or(
            eq(schema.users.email, identifier),
            eq(schema.users.name, identifier),
          ),
        )
        .execute();
    }
  }

  async wipeAllUserData() {
    return await this.db.delete(schema.users).execute();
  }

  async getUserRating(identifier: string | number) {
    const user = await this.getUser(identifier);
    if (user.length === 0) {
      throw new Error("User not found");
    }
    const userRatings = await this.db
      .select()
      .from(schema.ratings)
      .where(eq(schema.ratings.userId, user[0].id))
      .execute();
    return userRatings;
  }

  async createRating(userId: number, rating: number) {
    return await this.db
      .insert(schema.ratings)
      .values({
        userId: userId,
        score: rating,
      })
      .returning()
      .execute();
  }

  async deleteRating(ratingId: number) {
    return await this.db
      .delete(schema.ratings)
      .where(eq(schema.ratings.id, ratingId))
      .execute();
  }

  async updateRating(ratingId: number, newRating: number) {
    return await this.db
      .update(schema.ratings)
      .set({ score: newRating })
      .where(eq(schema.ratings.id, ratingId))
      .execute();
  }
}

export const userManager = new UserManager(db);
export class JobStandManager {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async createJobStand(standInfo: {
    standNumber: number;
    companyName: string;
    positionType: string;
    viable: string;
  }) {
    return await this.db
      .insert(schema.jobStands)
      .values(standInfo)
      .returning()
      .execute();
  }

  async getJobStand(id: number) {
    return await this.db
      .select()
      .from(schema.jobStands)
      .where(eq(schema.jobStands.id, id))
      .execute();
  }

  async getAllJobStands(limit: number = 10, offset: number = 0) {
    console.log("what up");
    return await this.db
      .select()
      .from(schema.jobStands)
      .limit(limit)
      .offset(offset)
      .execute();
  }

  async updateJobStand(
    id: number,
    updateData: Partial<typeof schema.jobStands.$inferInsert>,
  ) {
    return await this.db
      .update(schema.jobStands)
      .set(updateData)
      .where(eq(schema.jobStands.id, id))
      .execute();
  }

  async deleteJobStand(id: number) {
    return await this.db
      .delete(schema.jobStands)
      .where(eq(schema.jobStands.id, id))
      .execute();
  }

  async getJobStandRatings(id: number) {
    return await this.db
      .select({
        id: schema.ratings.id,
        score: schema.ratings.score,
        userId: schema.ratings.userId,
      })
      .from(schema.ratings)
      .where(eq(schema.ratings.jobStandId, id))
      .execute();
  }
}

export const jobStandManager = new JobStandManager(db);
