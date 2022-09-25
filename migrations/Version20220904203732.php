<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220904203732 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE page CHANGE title title VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE post DROP description');
        $this->addSql('ALTER TABLE uploaded_file CHANGE created_at updated_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE name name VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE uploaded_file CHANGE updated_at created_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE page CHANGE title title VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE name name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE post ADD description LONGTEXT DEFAULT NULL');
    }
}
