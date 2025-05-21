-- DropForeignKey
ALTER TABLE "Clash" DROP CONSTRAINT "Clash_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ClashItem" DROP CONSTRAINT "ClashItem_clash_id_fkey";

-- AddForeignKey
ALTER TABLE "Clash" ADD CONSTRAINT "Clash_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClashItem" ADD CONSTRAINT "ClashItem_clash_id_fkey" FOREIGN KEY ("clash_id") REFERENCES "Clash"("id") ON DELETE CASCADE ON UPDATE CASCADE;
