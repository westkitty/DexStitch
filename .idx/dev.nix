{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = with pkgs; [
    nodejs_20
    pnpm
    git
    rustc
    cargo
    wasm-pack
    binaryen
    wabt
    clang
    cmake
    pkg-config
    python3
  ];
  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "rust-lang.rust-analyzer"
    ];
    workspace = {
      onCreate = {
        install = "corepack enable && pnpm install --frozen-lockfile";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "pnpm" "--filter" "@dexstitch/frontend" "dev" "--host" "0.0.0.0" "--port" "5173" ];
          manager = "web";
        };
      };
    };
  };
}
