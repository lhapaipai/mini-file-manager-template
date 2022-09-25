<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220718153300 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE uploaded_file ADD type VARCHAR(64) DEFAULT NULL, CHANGE mime_type mime_type VARCHAR(64) DEFAULT NULL, CHANGE filename filename VARCHAR(255) DEFAULT NULL, CHANGE origin origin VARCHAR(64) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE uploaded_file DROP type, CHANGE mime_type mime_type VARCHAR(64) NOT NULL, CHANGE filename filename VARCHAR(255) NOT NULL, CHANGE origin origin VARCHAR(64) NOT NULL');
    }
}
