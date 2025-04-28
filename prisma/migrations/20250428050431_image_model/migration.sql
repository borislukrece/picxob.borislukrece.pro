-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "sub" VARCHAR(255),
    "uri" VARCHAR(255) NOT NULL,
    "prompt" TEXT,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_token_key" ON "images"("token");
