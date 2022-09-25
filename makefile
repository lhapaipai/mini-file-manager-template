datetime			:= $(shell date +"%Y-%m-%d-%H-%M")
date					:= $(shell date +"%Y-%m-%d")

local_path		:= $(PWD)
remote_path		:= /home/lhapaipai/prod/mini-file-manager.pentatrion.com

.PHONY: help
help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "} {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

link-submodule:
	rm -rf extra/*
	ln -s ../../mini-file-manager extra/mini-file-manager
	ln -s ../../upload-bundle/ extra/upload-bundle
deploy-to-berlin: remote-clear-cache
	rsync -rLptgoDv --delete \
	--exclude-from .rsyncignore \
	$(local_path)/ \
	berlin:$(remote_path)

	scp $(local_path)/.berlin/.env.local berlin:$(remote_path)/

	ssh berlin "\
		cd $(remote_path) && \
		symfony console doc:mig:mig -n"

	make remote-clear-cache

.PHONY: remote-clear-cache
remote-clear-cache: ## supprime le cache distant
	ssh berlin "sudo -- sh -c 'rm -rf $(remote_path)/var/cache/*'"

db-init:
	symfony console doc:sche:drop --full-database --force
	symfony console doc:mig:mig -n