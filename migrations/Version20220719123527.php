<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220719123527 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE uploaded_file ADD liip_id VARCHAR(255) DEFAULT NULL, ADD image_width INT DEFAULT NULL, ADD image_height INT DEFAULT NULL, ADD type VARCHAR(20) DEFAULT NULL, ADD size INT DEFAULT NULL, ADD created_at DATETIME DEFAULT NULL, ADD icon VARCHAR(64) DEFAULT NULL, ADD is_public TINYINT(1) DEFAULT NULL, DROP width, DROP height');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE uploaded_file ADD width INT DEFAULT NULL, ADD height INT DEFAULT NULL, DROP liip_id, DROP image_width, DROP image_height, DROP type, DROP size, DROP created_at, DROP icon, DROP is_public');
    }
}
