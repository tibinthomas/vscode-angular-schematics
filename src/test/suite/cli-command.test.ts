import * as vscode from 'vscode';
import * as path from 'path';
import * as assert from 'assert';
import { describe, before, it } from 'mocha';

import { angularCollectionName, defaultComponentTypes } from '../../defaults';
import { WorkspaceFolderConfig } from '../../workspace';
import { CliCommand } from '../../generation/cli-command';

import { rootProjectName, libProjectName, materialCollectionName, userComponentTypeLabel, subAppProjectName, defaultsWorkspaceFolderFsPath, customizedWorkspaceFolderFsPath } from './test-config';
import { COMPONENT_TYPE, ShortcutsTypes, MODULE_TYPE } from '../../workspace/shortcuts';

describe('Cli command', () => {

    let workspaceFolderDefaults: WorkspaceFolderConfig;
    let workspaceFolderCustomized: WorkspaceFolderConfig;

    before(async () => {

        workspaceFolderDefaults = new WorkspaceFolderConfig(vscode.workspace.workspaceFolders![0]);
        await workspaceFolderDefaults.init();

        workspaceFolderCustomized = new WorkspaceFolderConfig(vscode.workspace.workspaceFolders![1]);
        await workspaceFolderCustomized.init();

    });

    it('Basic component', () => {

        const cliCommand = new CliCommand(workspaceFolderDefaults);
        cliCommand.setProjectName(rootProjectName);
        cliCommand.setCollectionName(angularCollectionName);
        cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
        cliCommand.validateProject();
        cliCommand.setNameAsFirstArg('hello');

        assert.strictEqual(`ng g component hello`, cliCommand.getCommand());
        assert.strictEqual(path.join(defaultsWorkspaceFolderFsPath, 'src/app/hello/hello.component.ts'), cliCommand.guessGereratedFileFsPath());

    });

    it('Basic service', () => {

        const cliCommand = new CliCommand(workspaceFolderDefaults);
        cliCommand.setProjectName(rootProjectName);
        cliCommand.setCollectionName(angularCollectionName);
        cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('service')!);
        cliCommand.validateProject();
        cliCommand.setNameAsFirstArg('hello');

        assert.strictEqual(`ng g service hello`, cliCommand.getCommand());
        assert.strictEqual(path.join(defaultsWorkspaceFolderFsPath, 'src/app/hello.service.ts'), cliCommand.guessGereratedFileFsPath());

    });

    it('Basic module', () => {

        const cliCommand = new CliCommand(workspaceFolderDefaults);
        cliCommand.setProjectName(rootProjectName);
        cliCommand.setCollectionName(angularCollectionName);
        cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('module')!);
        cliCommand.validateProject();
        cliCommand.setNameAsFirstArg('hello');

        assert.strictEqual(`ng g module hello`, cliCommand.getCommand());
        assert.strictEqual(path.join(defaultsWorkspaceFolderFsPath, 'src/app/hello/hello.module.ts'), cliCommand.guessGereratedFileFsPath());

    });

    it('Basic interface', () => {

        const cliCommand = new CliCommand(workspaceFolderDefaults);
        cliCommand.setProjectName(rootProjectName);
        cliCommand.setCollectionName(angularCollectionName);
        cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('interface')!);
        cliCommand.validateProject();
        cliCommand.setNameAsFirstArg('hello');

        assert.strictEqual(`ng g interface hello`, cliCommand.getCommand());
        assert.strictEqual(path.join(defaultsWorkspaceFolderFsPath, 'src/app/hello.ts'), cliCommand.guessGereratedFileFsPath());

    });

    it('With project', () => {

        const cliCommand = new CliCommand(workspaceFolderCustomized);
        cliCommand.setProjectName(libProjectName);
        cliCommand.setCollectionName(angularCollectionName);
        cliCommand.setSchematic(workspaceFolderCustomized.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
        cliCommand.validateProject();
        cliCommand.setNameAsFirstArg('hello');

        assert.strictEqual(`ng g ${angularCollectionName}:component hello --project ${libProjectName}`, cliCommand.getCommand());
        assert.strictEqual(path.join(customizedWorkspaceFolderFsPath, 'projects', libProjectName, 'src/lib/hello.component.ts'), cliCommand.guessGereratedFileFsPath());

    });

    it('With collection', () => {

        const cliCommand = new CliCommand(workspaceFolderCustomized);
        cliCommand.setProjectName(rootProjectName);
        cliCommand.setCollectionName(materialCollectionName);
        cliCommand.setSchematic(workspaceFolderCustomized.collections.getCollection(materialCollectionName)!.getSchematic('table')!);
        cliCommand.validateProject();
        cliCommand.setNameAsFirstArg('hello');

        assert.strictEqual(`ng g ${materialCollectionName}:table hello`, cliCommand.getCommand());
        assert.strictEqual(path.join(customizedWorkspaceFolderFsPath, 'src/app/hello/hello.component.ts'), cliCommand.guessGereratedFileFsPath());

    });

    it('With path', () => {

        const cliCommand = new CliCommand(workspaceFolderDefaults);
        cliCommand.setProjectName(rootProjectName);
        cliCommand.setCollectionName(angularCollectionName);
        cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
        cliCommand.validateProject();
        cliCommand.setNameAsFirstArg('hello/world');

        assert.strictEqual(`ng g component hello/world`, cliCommand.getCommand());
        assert.strictEqual(path.join(defaultsWorkspaceFolderFsPath, 'src/app/hello/world/world.component.ts'), cliCommand.guessGereratedFileFsPath());

    });

    describe('with options', () => {

        it('string', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions([['changeDetection', 'OnPush']]);

            assert.strictEqual(`ng g component hello --changeDetection OnPush`, cliCommand.getCommand());

        });

        it('boolean', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions([['export', 'true']]);

            assert.strictEqual(`ng g component hello --export`, cliCommand.getCommand());

        });

        it('array', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('guard')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions([['implements', ['CanActivate', 'CanDeactivate']]]);

            assert.strictEqual(`ng g guard hello --implements CanActivate --implements CanDeactivate`, cliCommand.getCommand());

        });

        it('multiple', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions([['export', 'true'], ['changeDetection', 'OnPush']]);

            assert.strictEqual(`ng g component hello --export --changeDetection OnPush`, cliCommand.getCommand());

        });

        it('invalid', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions([['elmo', 'true']]);

            assert.strictEqual(`ng g component hello`, cliCommand.getCommand());

        });

    });

    describe('With component types', () => {

        let types: ShortcutsTypes;

        before(() => {
            types = workspaceFolderDefaults.getComponentTypes(rootProjectName);
        });

        it('Default', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions(types.get(COMPONENT_TYPE.DEFAULT)!.options);

            assert.strictEqual(`ng g component hello`, cliCommand.getCommand());

        });

        it('Page without type', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions(types.get(COMPONENT_TYPE.PAGE)!.options);

            assert.strictEqual(`ng g component hello --skipSelector`, cliCommand.getCommand());

        });

        it('Page with type', () => {

            const cliCommand = new CliCommand(workspaceFolderCustomized);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderCustomized.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');

            const typesCustomized = workspaceFolderCustomized.getComponentTypes(rootProjectName);
            cliCommand.addOptions(typesCustomized.get(COMPONENT_TYPE.PAGE)!.options);

            assert.strictEqual(`ng g ${angularCollectionName}:component hello --type page --skipSelector`, cliCommand.getCommand());
            assert.strictEqual(path.join(customizedWorkspaceFolderFsPath, 'src/app/hello.page.ts'), cliCommand.guessGereratedFileFsPath());

        });

        it('Pure', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions(types.get(COMPONENT_TYPE.PURE)!.options);
            
            assert.strictEqual(`ng g component hello --changeDetection OnPush`, cliCommand.getCommand());

        });

        it('Exported', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions(types.get(COMPONENT_TYPE.EXPORTED)!.options);
            
            assert.strictEqual(`ng g component hello --export --changeDetection OnPush`, cliCommand.getCommand());

        });

        it('From user preferences', () => {

            const cliCommand = new CliCommand(workspaceFolderCustomized);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderCustomized.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');

            const typesCustomized = workspaceFolderCustomized.getComponentTypes(rootProjectName);
            assert.strictEqual(true, typesCustomized.has(userComponentTypeLabel));

            cliCommand.addOptions(typesCustomized.get(userComponentTypeLabel)!.options);
            assert.strictEqual(`ng g ${angularCollectionName}:component hello --skipSelector --entryComponent`, cliCommand.getCommand());

        });

        it('From lib', () => {

            const cliCommand = new CliCommand(workspaceFolderCustomized);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderCustomized.collections.getCollection(angularCollectionName)!.getSchematic('component')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');

            const typesCustomized = workspaceFolderCustomized.getComponentTypes(subAppProjectName);
            assert.strictEqual(true, typesCustomized.has(defaultComponentTypes[0].label));

            cliCommand.addOptions(typesCustomized.get(defaultComponentTypes[0].label)!.options);
            assert.strictEqual(`ng g ${angularCollectionName}:component hello --type dialog --skipSelector`, cliCommand.getCommand());
            assert.strictEqual(path.join(customizedWorkspaceFolderFsPath, 'src/app/hello.dialog.ts'), cliCommand.guessGereratedFileFsPath());

        });

    });

    describe('With module types', () => {

        let types: ShortcutsTypes;

        before(() => {
            types = workspaceFolderDefaults.getModuleTypes();
        });

        it('Default', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('module')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions(types.get(MODULE_TYPE.DEFAULT)!.options);
            cliCommand.addOptions([['module', 'app']]);

            assert.strictEqual(`ng g module hello --module app`, cliCommand.getCommand());

        });

        it('Lazy', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('module')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions(types.get(MODULE_TYPE.LAZY)!.options);
            cliCommand.addOptions([['route', cliCommand.getRouteFromFirstArg()]]);

            assert.strictEqual(`ng g module hello --module app --route hello`, cliCommand.getCommand());

        });

        it('Lazy with path', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('module')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello/world');
            cliCommand.addOptions(types.get(MODULE_TYPE.LAZY)!.options);
            cliCommand.addOptions([['route', cliCommand.getRouteFromFirstArg()]]);

            assert.strictEqual(`ng g module hello/world --module app --route world`, cliCommand.getCommand());

        });

        it('Routing', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);
            cliCommand.setProjectName(rootProjectName);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('module')!);
            cliCommand.validateProject();
            cliCommand.setNameAsFirstArg('hello');
            cliCommand.addOptions(types.get(MODULE_TYPE.ROUTING)!.options);

            assert.strictEqual(`ng g module hello --module app --routing`, cliCommand.getCommand());

        });

    });

    describe('Context path', () => {

        it('none', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults);

            assert.strictEqual('', cliCommand['contextPath'].full);
            assert.strictEqual('', cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual('', cliCommand.getProjectName());

            assert.strictEqual('', cliCommand.getContextForNameAsFirstArg());

        });

        it('workspace folder', () => {

            const cliCommand = new CliCommand(workspaceFolderDefaults, defaultsWorkspaceFolderFsPath);

            assert.strictEqual(defaultsWorkspaceFolderFsPath, cliCommand['contextPath'].full);
            assert.strictEqual('', cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual('', cliCommand.getProjectName());

            assert.strictEqual('', cliCommand.getContextForNameAsFirstArg());

        });

        it('src folder', () => {

            const contextPath = path.join(defaultsWorkspaceFolderFsPath, 'src');
            const cliCommand = new CliCommand(workspaceFolderDefaults, contextPath);

            assert.strictEqual(contextPath, cliCommand['contextPath'].full);
            assert.strictEqual('src', cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual(rootProjectName, cliCommand.getProjectName());

            assert.strictEqual('', cliCommand.getContextForNameAsFirstArg());

        });

        it('src/app folder', () => {

            const contextPath = path.join(defaultsWorkspaceFolderFsPath, 'src/app');
            const cliCommand = new CliCommand(workspaceFolderDefaults, contextPath);

            assert.strictEqual(contextPath, cliCommand['contextPath'].full);
            assert.strictEqual('src/app', cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual(rootProjectName, cliCommand.getProjectName());

            assert.strictEqual('', cliCommand.getContextForNameAsFirstArg());

        });

        it('folder', () => {

            const contextPath = path.join(defaultsWorkspaceFolderFsPath, 'src/app/hello');
            const cliCommand = new CliCommand(workspaceFolderDefaults, contextPath);

            assert.strictEqual(contextPath, cliCommand['contextPath'].full);
            assert.strictEqual('src/app/hello', cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('hello', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual(rootProjectName, cliCommand.getProjectName());

            assert.strictEqual('hello/', cliCommand.getContextForNameAsFirstArg());

        });

        it('subfolder', () => {

            const contextPath = path.join(defaultsWorkspaceFolderFsPath, 'src/app/hello/world');
            const cliCommand = new CliCommand(workspaceFolderDefaults, contextPath);

            assert.strictEqual(contextPath, cliCommand['contextPath'].full);
            assert.strictEqual('src/app/hello/world', cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('hello/world', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual(rootProjectName, cliCommand.getProjectName());

            assert.strictEqual('hello/world/', cliCommand.getContextForNameAsFirstArg());

        });

        it('file', () => {

            const contextPath = path.join(defaultsWorkspaceFolderFsPath, 'src/app/hello/world.ts');
            const cliCommand = new CliCommand(workspaceFolderDefaults, contextPath);

            assert.strictEqual(contextPath, cliCommand['contextPath'].full);
            assert.strictEqual('src/app/hello/world.ts', cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('hello/world.ts', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual(rootProjectName, cliCommand.getProjectName());

            assert.strictEqual('hello/', cliCommand.getContextForNameAsFirstArg());

        });

        it('lib', () => {

            const contextPath = path.join(customizedWorkspaceFolderFsPath, 'projects', libProjectName, 'src/lib/hello/world');
            const cliCommand = new CliCommand(workspaceFolderCustomized, contextPath);

            assert.strictEqual(contextPath, cliCommand['contextPath'].full);
            assert.strictEqual(`projects/${libProjectName}/src/lib/hello/world`, cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('hello/world', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual(libProjectName, cliCommand.getProjectName());

            assert.strictEqual('hello/world/', cliCommand.getContextForNameAsFirstArg());

        });

        it('subapp', () => {

            const contextPath = path.join(customizedWorkspaceFolderFsPath, 'projects', subAppProjectName, 'src/app/hello/world');
            const cliCommand = new CliCommand(workspaceFolderCustomized, contextPath);

            assert.strictEqual(contextPath, cliCommand['contextPath'].full);
            assert.strictEqual(`projects/${subAppProjectName}/src/app/hello/world`, cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('hello/world', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual(subAppProjectName, cliCommand.getProjectName());

            assert.strictEqual('hello/world/', cliCommand.getContextForNameAsFirstArg());

        });

        it('@schematics/angular:library', () => {

            const contextPath = path.join(defaultsWorkspaceFolderFsPath, 'src/app/hello/world');
            const cliCommand = new CliCommand(workspaceFolderDefaults, contextPath);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('library')!);
        
            assert.strictEqual(contextPath, cliCommand['contextPath'].full);
            assert.strictEqual('src/app/hello/world', cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('hello/world', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual(rootProjectName, cliCommand.getProjectName());

            assert.strictEqual('', cliCommand.getContextForNameAsFirstArg());

        });

        it('@schematics/angular:application', () => {

            const contextPath = path.join(defaultsWorkspaceFolderFsPath, 'src/app/hello/world');
            const cliCommand = new CliCommand(workspaceFolderDefaults, contextPath);
            cliCommand.setCollectionName(angularCollectionName);
            cliCommand.setSchematic(workspaceFolderDefaults.collections.getCollection(angularCollectionName)!.getSchematic('application')!);
        
            assert.strictEqual(contextPath, cliCommand['contextPath'].full);
            assert.strictEqual('src/app/hello/world', cliCommand['contextPath'].relativeToWorkspaceFolder);
            assert.strictEqual('hello/world', cliCommand['contextPath'].relativeToProjectFolder);

            assert.strictEqual(rootProjectName, cliCommand.getProjectName());

            assert.strictEqual('', cliCommand.getContextForNameAsFirstArg());

        });

    });

});