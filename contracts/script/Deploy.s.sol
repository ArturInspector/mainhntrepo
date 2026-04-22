// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/VerificationToken.sol";
import "../src/core/MainAggregator.sol";
import "../src/adapters/GitcoinAdapter.sol";
import "../src/adapters/PoHAdapter.sol";
import "../src/adapters/BrightIDAdapter.sol";
import "../src/adapters/WorldcoinAdapter.sol";
import "../src/adapters/ConcordiumAdapter.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        address oracle = vm.envAddress("BACKEND_ORACLE");
        address easAddress = vm.envAddress("EAS_ADDRESS");
        bytes32 schemaUID = vm.envBytes32("EAS_SCHEMA_UID");

        vm.startBroadcast(deployerPk);

        VerificationToken token = new VerificationToken();
        MainAggregator aggregator = new MainAggregator(address(token));

        token.transfer(address(aggregator), 500_000 * 1e18);

        GitcoinAdapter gitcoin = new GitcoinAdapter(easAddress, schemaUID, address(aggregator), oracle);
        PoHAdapter poh = new PoHAdapter(easAddress, schemaUID, address(aggregator), oracle);
        BrightIDAdapter brightid = new BrightIDAdapter(easAddress, schemaUID, address(aggregator), oracle);
        ConcordiumAdapter concordium = new ConcordiumAdapter(easAddress, schemaUID, address(aggregator), oracle);

        aggregator.addAdapter(address(gitcoin), 1);
        aggregator.addAdapter(address(poh), 2);
        aggregator.addAdapter(address(brightid), 3);
        aggregator.addAdapter(address(concordium), 4);

        vm.stopBroadcast();

        console2.log("VerificationToken:   ", address(token));
        console2.log("MainAggregator:      ", address(aggregator));
        console2.log("GitcoinAdapter:      ", address(gitcoin));
        console2.log("PoHAdapter:          ", address(poh));
        console2.log("BrightIDAdapter:     ", address(brightid));
        console2.log("ConcordiumAdapter:   ", address(concordium));
    }
}
