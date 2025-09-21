-- CreateTable
CREATE TABLE "public"."PostFavorite" (
    "userId" INTEGER NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostFavorite_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateIndex
CREATE INDEX "PostFavorite_postId_userId_idx" ON "public"."PostFavorite"("postId", "userId");

-- CreateIndex
CREATE INDEX "PostFavorite_userId_createdAt_idx" ON "public"."PostFavorite"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."PostFavorite" ADD CONSTRAINT "PostFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostFavorite" ADD CONSTRAINT "PostFavorite_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
