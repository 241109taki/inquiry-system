# 開発用
resume:
	git pull
	cd backend && npm install
	cd frontend && npm install
	docker compose up -d --build
	@echo "====== すべての開発環境が同期されました!! ======"

stop:
	docker compose down

logs:
	docker compose logs -f