{
  description = "Dev shell for pacokwon.org";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/647371df145ef56cf62811c906fc794b91df2f8f";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "aarch64-darwin" "x86_64-darwin" "aarch64-linux" "x86_64-linux" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.zola
            ];

            shellHook = ''
              echo "zola: $(zola --version)"
            '';
          };
        }
      );
    };
}
