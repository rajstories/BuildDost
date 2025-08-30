import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  Link as LinkIcon, 
  Eye,
  Code,
  Sparkles,
  Table,
  Key,
  GitBranch
} from "lucide-react";

interface TableColumn {
  name: string;
  type: string;
  required: boolean;
  primaryKey: boolean;
  unique: boolean;
}

interface DatabaseTable {
  id: string;
  name: string;
  columns: TableColumn[];
  position: { x: number; y: number };
  relations: string[];
}

interface Relation {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export default function DatabaseVisualizer() {
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [newTableName, setNewTableName] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [generatedSchema, setGeneratedSchema] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize with sample data for demo
  useEffect(() => {
    const sampleTables: DatabaseTable[] = [
      {
        id: "users",
        name: "users",
        columns: [
          { name: "id", type: "serial", required: true, primaryKey: true, unique: true },
          { name: "username", type: "varchar(50)", required: true, primaryKey: false, unique: true },
          { name: "email", type: "varchar(100)", required: true, primaryKey: false, unique: true },
          { name: "password", type: "varchar(255)", required: true, primaryKey: false, unique: false },
          { name: "created_at", type: "timestamp", required: true, primaryKey: false, unique: false }
        ],
        position: { x: 50, y: 50 },
        relations: ["posts", "comments"]
      },
      {
        id: "posts",
        name: "posts",
        columns: [
          { name: "id", type: "serial", required: true, primaryKey: true, unique: true },
          { name: "title", type: "varchar(200)", required: true, primaryKey: false, unique: false },
          { name: "content", type: "text", required: true, primaryKey: false, unique: false },
          { name: "user_id", type: "integer", required: true, primaryKey: false, unique: false },
          { name: "published", type: "boolean", required: false, primaryKey: false, unique: false },
          { name: "created_at", type: "timestamp", required: true, primaryKey: false, unique: false }
        ],
        position: { x: 400, y: 50 },
        relations: ["comments"]
      },
      {
        id: "comments",
        name: "comments",
        columns: [
          { name: "id", type: "serial", required: true, primaryKey: true, unique: true },
          { name: "content", type: "text", required: true, primaryKey: false, unique: false },
          { name: "user_id", type: "integer", required: true, primaryKey: false, unique: false },
          { name: "post_id", type: "integer", required: true, primaryKey: false, unique: false },
          { name: "created_at", type: "timestamp", required: true, primaryKey: false, unique: false }
        ],
        position: { x: 225, y: 300 },
        relations: []
      }
    ];

    const sampleRelations: Relation[] = [
      { from: "users", to: "posts", type: "one-to-many" },
      { from: "users", to: "comments", type: "one-to-many" },
      { from: "posts", to: "comments", type: "one-to-many" }
    ];

    setTables(sampleTables);
    setRelations(sampleRelations);
  }, []);

  const addTable = () => {
    if (!newTableName.trim()) return;
    
    const newTable: DatabaseTable = {
      id: newTableName.toLowerCase(),
      name: newTableName.toLowerCase(),
      columns: [
        { name: "id", type: "serial", required: true, primaryKey: true, unique: true }
      ],
      position: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 },
      relations: []
    };

    setTables(prev => [...prev, newTable]);
    setNewTableName("");
  };

  const addColumn = (tableId: string) => {
    const newColumn: TableColumn = {
      name: "new_column",
      type: "varchar(255)",
      required: false,
      primaryKey: false,
      unique: false
    };

    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, columns: [...table.columns, newColumn] }
        : table
    ));
  };

  const removeTable = (tableId: string) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
    setRelations(prev => prev.filter(rel => rel.from !== tableId && rel.to !== tableId));
  };

  const generateSchema = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call for schema generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const drizzleSchema = `import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Generated Tables
${tables.map(table => `
export const ${table.name} = pgTable('${table.name}', {
${table.columns.map(col => `  ${col.name}: ${getColumnDefinition(col)}`).join(',\n')}
});`).join('\n')}

// Generated Relations
${tables.map(table => {
  const tableRelations = relations.filter(rel => rel.from === table.id);
  if (tableRelations.length === 0) return '';
  
  return `export const ${table.name}Relations = relations(${table.name}, ({ one, many }) => ({
${tableRelations.map(rel => `  ${rel.to}: ${rel.type.includes('many') ? 'many' : 'one'}(${rel.to})`).join(',\n')}
}));`;
}).filter(Boolean).join('\n\n')}

// Export all tables and relations
export const schema = {
${tables.map(table => `  ${table.name}`).join(',\n')}
};`;

      setGeneratedSchema(drizzleSchema);
    } catch (error) {
      console.error('Schema generation failed:', error);
    }
    
    setIsGenerating(false);
  };

  const getColumnDefinition = (column: TableColumn): string => {
    const baseType = column.type.includes('varchar') ? `varchar(${column.type.match(/\d+/)?.[0] || '255'})` :
                     column.type === 'serial' ? 'serial' :
                     column.type === 'text' ? 'text()' :
                     column.type === 'integer' ? 'integer()' :
                     column.type === 'boolean' ? 'boolean()' :
                     column.type === 'timestamp' ? 'timestamp()' :
                     'varchar(255)';
                     
    const modifiers = [];
    if (column.primaryKey) modifiers.push('.primaryKey()');
    if (column.required && !column.primaryKey) modifiers.push('.notNull()');
    if (column.unique) modifiers.push('.unique()');
    
    return `${baseType}${modifiers.join('')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Schema Visualizer</span>
            <Badge variant="secondary">Hackathon Winner</Badge>
          </CardTitle>
          <CardDescription>
            Design your database schema visually and generate production-ready code
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="visual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visual">Visual Designer</TabsTrigger>
              <TabsTrigger value="schema">Generated Schema</TabsTrigger>
              <TabsTrigger value="api">API Endpoints</TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="space-y-4">
              {/* Add Table Controls */}
              <div className="flex space-x-3 items-center p-4 bg-gray-50 rounded-lg">
                <Input
                  placeholder="Table name (e.g., products, orders)"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="max-w-xs"
                  data-testid="input-table-name"
                />
                <Button onClick={addTable} disabled={!newTableName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Table
                </Button>
                <Button 
                  onClick={generateSchema} 
                  disabled={isGenerating || tables.length === 0}
                  variant="outline"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Code'}
                </Button>
              </div>

              {/* Visual Schema Designer */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[500px] bg-gray-50/50 relative overflow-auto">
                {tables.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Table className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Start by adding your first table above</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {/* Relations Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {relations.map((relation, index) => {
                        const fromTable = tables.find(t => t.id === relation.from);
                        const toTable = tables.find(t => t.id === relation.to);
                        if (!fromTable || !toTable) return null;

                        const fromX = fromTable.position.x + 150;
                        const fromY = fromTable.position.y + 50;
                        const toX = toTable.position.x + 150;
                        const toY = toTable.position.y + 50;

                        return (
                          <line
                            key={index}
                            x1={fromX}
                            y1={fromY}
                            x2={toX}
                            y2={toY}
                            stroke="#6b7280"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                        );
                      })}
                    </svg>

                    {/* Tables */}
                    {tables.map((table) => (
                      <div
                        key={table.id}
                        className="absolute bg-white border border-gray-300 rounded-lg shadow-lg w-80"
                        style={{ left: table.position.x, top: table.position.y }}
                      >
                        {/* Table Header */}
                        <div className="bg-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Table className="h-4 w-4" />
                            <span className="font-semibold">{table.name}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addColumn(table.id)}
                              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTable(table.id)}
                              className="h-6 w-6 p-0 text-white hover:bg-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Table Columns */}
                        <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                          {table.columns.map((column, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-2 rounded bg-gray-50 text-sm"
                            >
                              <div className="flex items-center space-x-1">
                                {column.primaryKey && <Key className="h-3 w-3 text-yellow-600" />}
                                {column.unique && <Badge variant="outline" className="h-4 text-xs">unique</Badge>}
                              </div>
                              <span className="font-medium flex-1">{column.name}</span>
                              <span className="text-gray-500 text-xs">{column.type}</span>
                              {column.required && <span className="text-red-500 text-xs">*</span>}
                            </div>
                          ))}
                        </div>

                        {/* Relations Indicator */}
                        {table.relations.length > 0 && (
                          <div className="p-2 border-t bg-gray-50 rounded-b-lg">
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <GitBranch className="h-3 w-3" />
                              <span>Relations: {table.relations.join(', ')}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="schema" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Drizzle Schema</h3>
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(generatedSchema)}
                  disabled={!generatedSchema}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>

              {generatedSchema ? (
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96">
                  <code>{generatedSchema}</code>
                </pre>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Code className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Design your tables first, then generate the schema code</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <div className="text-center py-12 text-gray-500">
                <LinkIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>API endpoints will be generated automatically based on your schema</p>
                <div className="mt-4 space-y-2 text-sm">
                  {tables.map(table => (
                    <div key={table.id} className="p-2 bg-gray-50 rounded">
                      <span className="font-mono">GET/POST/PUT/DELETE /api/{table.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}