import { pgTable, text, timestamp, integer, boolean, varchar, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (Clerk will handle auth, we'll sync user data)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Profiles table
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  bio: text('bio'),
  age: integer('age'),
  gender: varchar('gender', { length: 50 }),
  location: varchar('location', { length: 255 }),
  latitude: integer('latitude'),
  longitude: integer('longitude'),
  photos: jsonb('photos').$type<string[]>(),
  interests: jsonb('interests').$type<string[]>(),
  lookingFor: varchar('looking_for', { length: 100 }),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  lastActive: timestamp('last_active').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  senderId: text('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  receiverId: text('receiver_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Likes table
export const likes = pgTable('likes', {
  id: text('id').primaryKey(),
  likerId: text('liker_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  likedId: text('liked_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Matches table
export const matches = pgTable('matches', {
  id: text('id').primaryKey(),
  user1Id: text('user1_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  user2Id: text('user2_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'receiver' }),
  likes: many(likes, { relationName: 'liker' }),
  likedBy: many(likes, { relationName: 'liked' }),
  matches: many(matches, { relationName: 'user1' }),
  matchedWith: many(matches, { relationName: 'user2' }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  liker: one(users, {
    fields: [likes.likerId],
    references: [users.id],
    relationName: 'liker',
  }),
  liked: one(users, {
    fields: [likes.likedId],
    references: [users.id],
    relationName: 'liked',
  }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  user1: one(users, {
    fields: [matches.user1Id],
    references: [users.id],
    relationName: 'user1',
  }),
  user2: one(users, {
    fields: [matches.user2Id],
    references: [users.id],
    relationName: 'user2',
  }),
})); 