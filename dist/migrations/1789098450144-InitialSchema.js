"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1789098450144 = void 0;
class InitialSchema1789098450144 {
    name = 'InitialSchema1789098450144';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "SYSTEM_USER" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "isNotificationEnabled" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_5b250ddb22b3e4f8234ab172021" UNIQUE ("email"), CONSTRAINT "PK_3f5912604df1254054eac4f2b5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "WATER_REPORT" ("id" SERIAL NOT NULL, "address" text NOT NULL, "description" text NOT NULL, "severity" text NOT NULL, "reporterPhone" text NOT NULL, "isResolved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b232cdd6d3e95978564720c2ebe" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "WATER_REPORT"`);
        await queryRunner.query(`DROP TABLE "SYSTEM_USER"`);
    }
}
exports.InitialSchema1789098450144 = InitialSchema1789098450144;
//# sourceMappingURL=1789098450144-InitialSchema.js.map