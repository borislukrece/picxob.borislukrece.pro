import { Prisma } from "@/generated/prisma";

export const autoUpdateTimestamp = Prisma.defineExtension({
    name: 'AutoUpdateTimestamp',
    query: {
        $allModels: {
            async update({ args, query }) {
                if (!args.data) args.data = {};
                args.data.updatedAt = new Date();
                return query(args);
            },
            async updateMany({ args, query }) {
                if (!args.data) args.data = {};
                args.data.updatedAt = new Date();
                return query(args);
            }
        }
    }
});
