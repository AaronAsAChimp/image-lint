(self.webpackChunkimage_lint_web=self.webpackChunkimage_lint_web||[]).push([[179],{5292:(e,t,r)=>{"use strict";var s=r(2661),n=r(4336),i=r(8917),o=r(8319);const a={class:"lint-header"},l={class:"lint-title"},c={class:"lint-version"},h={class:"lint-subtitle"},_=(0,i.Uk)(" Star "),u={class:"image-lint-app"},d={class:"pane pane-options"},m=(0,i._)("h3",{class:"lint-options-title"}," Options ",-1),p={class:"lint-option lint-option-check"},f=(0,i.Uk)(" Find mismatches between file type and file extension. "),g={class:"lint-option lint-option-check"},w=(0,i.Uk)(" Find files that have been copied. "),b={class:"lint-option lint-option-number"},x=(0,i.Uk)(" Set the maximum bytes per pixel before giving a warning. "),v={class:"lint-option lint-option-number"},y=(0,i.Uk)(" Set the minimum byte savings before giving a warning. "),k={class:"lint-option lint-option-array"},U=(0,i.Uk)(" Set the allowed color spaces. "),B={class:"pane pane-dropzone"},I={key:0};var E=r(7992),z=r(343);class C extends z.EventEmitter{constructor(){super(),this._active_handlers=0,this._active_processes=0,this._done_proxy=this._done.bind(this),this._iterator=null,this._stopped=!1,this.on("handler.available",this._handler_available.bind(this))}_handler_available(){if(this._iterator){const e=this._iterator.next();e.done?this._iterator=null:(this.emit("next",e.value,this._done_proxy),this._active_handlers++,this._active_processes++)}}_done(){if(this._active_handlers--,this._active_processes--,!this._stopped){if(!(this._active_handlers>=0)||this._stopped)throw new Error("No handlers available, did you call done?");this.emit("handler.available")}this._active_processes<=0&&this.emit("end")}is_stopped(){return this._stopped}start(e){if(this._iterator)throw new Error("Work is in progress");this._active_handlers=0,e.then((e=>{for(this._iterator=e();this._active_handlers<10;)this.emit("handler.available"),this._active_handlers++}),(e=>{e.stack?console.error(`${e.name}: ${e.message} \n`,e):console.error("Error",e)})).catch((e=>{e.stack?console.error(`${e.name}: ${e.message} \n`,e):console.error("Error",e)}))}stop(){this._stopped=!0}}var S=r(2337);class G{constructor(){this.trie=new Map}find(e){let t=this.trie,r=0;for(;r<=3;){const s=t,n=e[r];t=t.get(n),t||(t=new Map,s.set(n,t)),r++}return t}contains(e,t){const r=S.createHash("sha1");r.update(t);const s=r.digest("binary"),n=this.find(s),i=n.get(s);return i||n.set(s,e),i}}class D{constructor(e,t){this.name=e,this.channels=t,this.unk_format=null,D.all_names.add(e)}getUnkFormat(){return this.unk_format}static from(e){let t=null;return this.all_names.has(e)&&(t=D[e]),t}static unkownFormat(e,t=-1){const r=new D("UNK",t);return r.unk_format=e,r}}D.all_names=new Set,D.G=new D("G",1),D.RGB=new D("RGB",3),D.YCbCr=new D("YCbCr",3),D.YCCK=new D("YCCK",4),D.LAB=new D("LAB",3),D.HSV=new D("HSV",3),D.CMYK=new D("CMYK",4),D.XYZ=new D("XYZ",3),D.XYB=new D("XYB",3);class M{constructor(){this.indexed=!1,this.alpha=!1,this.bit_depth={}}}var R=r(5479);class Y{constructor(e=null,t=null){this.filename=e,this.parent=t,this.log="",this._muted=!1,this.count={info:0,warn:0,error:0}}_increment_count(e){this.count[e]++,this.parent&&this.parent._increment_count(e)}is_printable(){return this.count.warn>0||this.count.error>0}mute(){this._muted=!0}info(e){this._increment_count("info"),this.log+="\n  INFO:  "+e}warn(e){this._increment_count("warn"),this.log+="\n  "+R.yellow("WARN:")+"  "+e}error(e){this._increment_count("error"),this.log+="\n  "+R.red("ERROR:")+"  "+e}get_error_count(){return this.count.error}get_warning_count(){return this.count.warn}get_logger(e){return new Y(e,this)}toString(){let e=this.count.warn.toString(),t=this.count.error.toString();return this.count.warn&&(e=R.yellow(e)),this.count.error&&(t=R.red(t)),this.filename+this.log+"\n"+e+" warnings. "+t+" errors."}}const F=new Y;class N{constructor(){this._info_provider=null}identify_only(){return!this.get_info_provider()}is_of_file_type(e){throw new Error("Not Implemented")}get_extension(){return this.get_extensions()[0]}get_extensions(){throw new Error("Not Implemented")}get_mime(){return this.get_mimes()[0]}get_mimes(){throw new Error("Not Implemented")}can_validate(e){return!1}get_info_provider(){return null}static register(e){const t=new e,r=t.identify_only();for(const e of t.get_extensions())this._extension_registry.set(e,t),r||this._all_extensions.push(e);for(const e of t.get_mimes())this._mime_registry.set(e,t),r||this._all_mimes.push(e);this._all_providers.push(t)}static clear_registry(){this._extension_registry.clear(),this._all_extensions.length=0,this._mime_registry.clear(),this._all_mimes.length=0,this._all_providers.length=0}static get_all_extensions(){return N._all_extensions}static get_all_mimes(){return N._all_mimes}static from_extension(e){return N._extension_registry.get(e)}static*all_providers(){yield*N._all_providers}}N._extension_registry=new Map,N._mime_registry=new Map,N._all_providers=[],N._all_extensions=[],N._all_mimes=[];var V=r(816).Buffer;class $ extends N{get_magic(){throw new Error("Not Implemented")}is_of_file_type(e){const t=this.get_magic(),r=e.slice(0,t.length);return 0===V.compare(t,r)}can_validate(e){const t=this.get_magic();return e.length>=t.length}}var L=r(1461);class q{calculate_bpp(e,t){return(t-this.get_overhead())/(e.width*e.height*e.frames)}get_overhead(){return 0}get_dimensions(e){throw new Error("Not Implemented")}get_pixel_format(e){throw new Error("Not Implemented")}get_info(e){const t={truncated:this.is_truncated(e)};if(!t.truncated){const r=this.get_dimensions(e);t.dimensions=r,t.size=e.length,t.pixel_format=this.get_pixel_format(e),t.bytes_per_pixel=this.calculate_bpp(r,e.length)}return t}is_truncated(e){throw new Error("Not Implemented")}}var A=r(816).Buffer;const T=new Set([0,4]),j=new Set([2,3,6]),O=new Set([4,6]),K=new Set([4]);class P{constructor(e,t){this.length=e.readUInt32BE(t),this.header=e.readUInt32BE(t+4),this.data=e.slice(t+4+4,this.length),this.crc32=e.readUInt32BE(t+4+4+this.length)}verify(){const e=A.alloc(4);let t=null;return e.writeUInt32BE(this.header,0),t=L.ZP.crc32(e),t=L.ZP.crc32(this.data,t),t===this.crc32}}class W extends q{get_overhead(){return 67}is_truncated(e){let t=null;try{t=new P(e,e.length-12)}catch(e){return!0}return 1229278788===t.header&&!t.verify()}get_dimensions(e){return{width:e.readUInt32BE(16),height:e.readUInt32BE(20),frames:1}}get_pixel_format(e){const t=new M,r=e.readInt8(24),s=e.readInt8(25);return j.has(s)?(t.color_space=D.RGB,t.bit_depth.R=r,t.bit_depth.G=r,t.bit_depth.B=r):T.has(s)?(t.color_space=D.G,t.bit_depth.G=r):t.color_space=D.unkownFormat(s),O.has(s)&&(t.alpha=!0,t.bit_depth.alpha=r),K.has(s)&&(t.indexed=!0),t}}var Z=r(816).Buffer;N.register(class extends ${get_magic(){return Z.from("89504e470d0a1a0a","hex")}get_extensions(){return[".png"]}get_mimes(){return["image/png"]}get_info_provider(){return W}});class H extends q{get_overhead(){return 35}next_chunk(e,t){const r=2+e.readUInt8(t+2);return t+r+this.get_sub_block_length(e,t+r+1)+1}get_sub_block_length(e,t){let r=0,s=e.readUInt8(t);if(0!==s)for(;0!==s;)s=e.readUInt8(t+r),r+=s+1;else r=1;return r}get_color_table_length(e,t){const r=7&e.readUInt8(t);return 3*Math.pow(2,r+1)}has_color_table(e,t){return!!(128&e.readUInt8(t))}get_version(e){return e.toString("ascii",3,6)}get_dimensions(e){let t=0,r=!1,s=0;for(s=this.has_color_table(e,10)?13+this.get_color_table_length(e,10):13;!r;){let n=e.readUInt8(s);44===n&&(t++,s+=9,this.has_color_table(e,s)&&(s+=this.get_color_table_length(e,s)),s+=2,s+=this.get_sub_block_length(e,s)),s+1>=e.length?r=!0:(n=e.readUInt8(s),33===n||44===n?s=this.next_chunk(e,s):r=!0)}return{width:e.readUInt16LE(6),height:e.readUInt16LE(8),frames:t}}is_truncated(e){return 59!==e.readUInt8(e.length-1)}get_pixel_format(){const e=new M;return e.color_space=D.RGB,e.indexed=!0,e.bit_depth.R=8,e.bit_depth.G=8,e.bit_depth.B=8,e.bit_depth.alpha=1,e}}var X=r(816).Buffer;N.register(class extends ${get_magic(){return X.from("GIF")}get_extensions(){return[".gif"]}get_mimes(){return["image/gif"]}get_info_provider(){return H}});class J extends q{next_chunk(e,t){return t+2+e.readUInt16BE(t+2)}is_sof_chunk(e,t){const r=e.readUInt8(t+1);return 192==(240&r)&&196!==r&&200!==r&&204!==r}*chunks(e){let t=this.next_chunk(e,2),r=!1;for(;!r;)yield t,t=this.next_chunk(e,t),t>e.length&&(r=!0)}get_overhead(){return 119}is_truncated(e){return 65497!==e.readUInt16BE(e.length-2)}get_dimensions(e){let t=null,r=null;for(const s of this.chunks(e))if(this.is_sof_chunk(e,s)){t=e.readUInt16BE(s+7),r=e.readUInt16BE(s+5);break}if(!t||!r)throw new Error("Dimensions not found");return{width:t,height:r,frames:1}}get_pixel_format(e){const t=new M;let r=null;for(const t of this.chunks(e))if(this.is_sof_chunk(e,t)){r=e.readUInt8(t+9);break}return t.color_space=1===r?D.G:3===r?D.RGB:4===r?D.CMYK:D.unkownFormat("Unknown",r),t}}var Q=r(816).Buffer;N.register(class extends ${get_magic(){return Q.from("ffd8ff","hex")}get_extensions(){return[".jpg",".jpeg",".jpe"]}get_mimes(){return["image/jpeg"]}get_info_provider(){return J}});const ee=4294967295;class te extends Error{}class re{constructor(e,t=0){this.buffer=e,this.offset=t,this.sub_bit=0,this.current_byte=e.readUInt8(t)}read_from_byte(e,t,r){let s=e,n=(1<<r)-1;return n=n<<t>>>0,s=(s&n)>>>t,s}read_bits(e){if(e>32)throw new Error(`Can not read more than 32 bits at a time. Attempting to read ${e}`);if(0===e)return 0;let t=0,r=0;const s=8-this.sub_bit;this.sub_bit>0&&e>s&&(e-=s,t=this.read_from_byte(this.current_byte,this.sub_bit,s),r=s,this.offset+=1,this.current_byte=this.buffer.readUInt8(this.offset),this.sub_bit=0);const n=Math.floor(e/8);let i=t;if(n>0){for(let e=0;e<n;e++){let e=this.read_from_byte(this.current_byte,0,8);r&&(e<<=r),this.offset+=1,this.current_byte=this.buffer.readUInt8(this.offset),r+=8,i|=e}this.sub_bit=0}if((e-=8*n)>0){let t=this.read_from_byte(this.current_byte,this.sub_bit,e);r&&(t<<=r),i|=t,this.sub_bit+=e}return i}read_boolean(){return!!this.read_bits(1)}read_u32(...e){if(e.length>4)throw new Error("U32: A u32 takes only 4 distributions.");const t=e[this.read_bits(2)];if(0===t[0])return t[1];if(1===t[0])return this.read_bits(t[1]);if(2===t[0]){if(3!==t.length)throw new Error("U32: incorrect number of parameters for BitsOffset distribution.");return(t[2]+this.read_bits(t[1]))%ee}throw new Error("U32: Unknown distribution.")}read_s32(...e){const t=this.read_u32(...e);return t%2==0?t>>1:t===ee?2147483648:-(t>>1)}read_f16(){const e=this.read_bits(16),t=e>>15,r=e>>10&31,s=1023&e;let n;if(31===r)throw new te("F16: Invalid biased exponent.");if(0==r)n=s/(1<<24);else{const e=r+112,i=s<<13,o=new ArrayBuffer(4);new Uint32Array(o)[0]=t<<31|e<<23|i,n=new Float32Array(o)[0]}return n}read_customxy(){return{x:this.read_s32([1,19],[2,19,524288],[2,20,1048576],[2,21,2097152]),y:this.read_s32([1,19],[2,19,524288],[2,20,1048576],[2,21,2097152])}}read_enum(e){const t=this.read_u32([0,0],[0,1],[2,4,2],[2,6,18]);if(t>63)throw new te(`Enum: Invalid value: ${t}`);if(!e.has(t))throw new te(`Enum: Unknown value: ${t}`);return t}get_bits_read(){return 8*this.offset+this.sub_bit}}class se{constructor(e){let t,r;if(this.small=e.read_boolean(),t=this.small?8*(e.read_bits(5)+1):e.read_u32([1,9],[1,13],[1,18],[1,30])+1,this.ratio=e.read_bits(3),0===this.ratio)r=this.small?8*(e.read_bits(5)+1):e.read_u32([1,9],[1,13],[1,18],[1,30])+1;else if(1===this.ratio)r=t;else if(2===this.ratio)r=Math.floor(12*t/10);else if(3===this.ratio)r=Math.floor(4*t/3);else if(4===this.ratio)r=Math.floor(3*t/2);else if(5===this.ratio)r=Math.floor(16*t/9);else if(6===this.ratio)r=Math.floor(5*t/4);else{if(7!==this.ratio)throw new Error("SizeHeader: unknown aspect ratio.");r=Math.floor(2*t/1)}this.ysize=t,this.xsize=r}get_small(){return this.small}get_ysize(){return this.ysize}get_xsize(){return this.xsize}get_ratio(){return this.ratio}}const ne=new Set;ne.add(0),ne.add(1),ne.add(2),ne.add(3),ne.add(4);const ie=new Set;ie.add(1),ie.add(2),ie.add(10),ie.add(11);const oe=new Set;oe.add(1),oe.add(2),oe.add(9),oe.add(11);const ae=new Set;ae.add(1),ae.add(2),ae.add(8),ae.add(13),ae.add(16),ae.add(17),ae.add(18);const le=new Set;le.add(0),le.add(1),le.add(2),le.add(3);class ce{constructor(e){if(this.received_icc=!1,this.opaque_icc=!1,this.color_space=0,this.white_point=1,this.primaries=1,this.have_gamma=!1,this.gamma=0,this.transfer_function=13,this.rendering_intent=1,e){const t=e.read_boolean();t||(this.received_icc=e.read_boolean(),this.received_icc?this.opaque_icc=e.read_boolean():this.opaque_icc=!1,t||this.opaque_icc||(this.color_space=e.read_enum(ne),2!==this.color_space&&4!==this.color_space&&(this.white_point=e.read_enum(ie),2===this.white_point&&(this.white=e.read_customxy()),1!==this.color_space&&(this.primaries=e.read_enum(oe),2===this.primaries&&(this.red=e.read_customxy(),this.green=e.read_customxy(),this.blue=e.read_customxy())),this.have_gamma=e.read_boolean(),this.have_gamma?this.gamma=e.read_bits(24):this.transfer_function=e.read_enum(ae),1!==this.color_space&&(this.rendering_intent=e.read_enum(le)))))}}}class he{constructor(e){e.read_boolean()?(this.have_icc=!1,this.bits_per_sample=8,this.color_encoding=new ce,this.alpha_bits=0,this.target_nits=250,this.m2=null):(this.have_icc=e.read_boolean(),this.bits_per_sample=e.read_u32([0,8],[0,16],[0,32],[1,5]),this.color_encoding=new ce(e),this.alpha_bits=e.read_u32([0,0],[0,8],[0,16],[1,4]),this.target_nits=e.read_u32([0,5],[0,20],[0,80],[2,10,1]),this.m2=null)}}class _e extends q{get_overhead(){return 119}is_truncated(e){return 0!==e.readUInt8(e.length-1)}get_dimensions(e){const t=new re(e,0),r=new se(t);return{width:r.get_xsize(),height:r.get_ysize(),frames:1}}get_pixel_format(e){const t=new re(e,0),r=new he(t).color_encoding,s=new M;return r&&(1===r.color_space?s.color_space=D.G:0===r.color_space?s.color_space=D.RGB:4===r.color_space?s.color_space=D.XYZ:2===r.color_space?s.color_space=D.XYB:s.color_space=D.unkownFormat(r)),s}}var ue=r(816).Buffer;N.register(class extends ${get_magic(){return ue.from("ff0a","hex")}get_extensions(){return[".jxl"]}get_mimes(){return["image/jxl"]}get_info_provider(){return _e}});class de{constructor(e,t){this.length=e,this.tag=t}static read(e,t){let r;const s=e.readUInt32BE(t);if(s){const n=e.toString("ascii",t+4,t+8),i=e.subarray(t+8,t+s);r=n in we?new we[n](s,n,i):new pe(s,n,i)}else r=new fe;return r}}class me extends de{constructor(e,t,r,s=0){super(e,t),this._buffer=r,this._offset=s,this._children=null}get children(){const e=this._buffer,t=this._offset;if(!this._children){this._children={};for(const r of this.readBlocks(e,t))null===r.tag||this._children[r.tag]||(this._children[r.tag]=r)}return this._children}*readBlocks(e,t){let r=0,s=2048;for(;r+t<e.length&&s;){const n=de.read(e,t+r);r+=n.length,s--,yield n}}}class pe extends de{constructor(e,t,r){super(e,t),this.content=r}}class fe extends de{constructor(){super(4,null)}}class ge extends me{constructor(e){super(e.length,null,e)}}const we={ftyp:class extends de{constructor(e,t,r){super(e,t),this.majorBrand=this.readBrand(0,r),this.minorVersion=r.readUInt32BE(4),this.compatibleBrands=[];const s=(e-16)/4;for(let e=0;e<s;e++)this.compatibleBrands.push(this.readBrand(4*e+8,r))}readBrand(e,t){return t.subarray(e,e+4).toString("ascii")}},meta:me,iprp:me,iinf:class extends me{constructor(e,t,r){super(e,t,r,6)}},ipco:me,ispe:class extends de{constructor(e,t,r){super(e,t),this.unknown=r.readUInt32BE(0),this.width=r.readUInt32BE(4),this.height=r.readUInt32BE(8)}},pixi:class extends de{constructor(e,t,r){super(e,t,r),this.unknown=r.readUInt32BE(0),this.channels=r.readUInt8(4),this.bitsPerChannel=[];for(let e=0;e<this.channels;e++)this.bitsPerChannel.push(r.readUInt8(5))}}};class be extends q{get_overhead(){return 333}is_truncated(e){return!1}get_dimensions(e){const t=new ge(e).children.meta.children.iprp.children.ipco.children.ispe;return{width:t.width,height:t.height,frames:1}}get_pixel_format(e){const t=new ge(e),r=new M;r.color_space=D.RGB;const s=t.children.meta.children.iprp.children.ipco.children.pixi;if(s){const e=s.channels;r.color_space=1===e?D.G:3===e?D.RGB:D.unkownFormat("Unknown",e)}else r.color_space=D.RGB;return r}}N.register(class extends N{can_validate(e){return e.length>12}is_of_file_type(e){const t=e.subarray(4,12).toString("ascii");return"ftypavif"===t||"ftypheic"===t}get_extensions(){return[".avif",".heif",".heic"]}get_mimes(){return["image/avif","image/heif","image/heic"]}get_info_provider(){return be}});var xe=r(816).Buffer;N.register(class extends ${get_magic(){return xe.from("424D","hex")}get_extensions(){return[".bmp"]}get_mimes(){return["image/bmp","image/x-bmp"]}});var ve=r(816).Buffer;N.register(class extends ${get_magic(){return ve.from("38425053","hex")}get_extensions(){return[".psd"]}get_mimes(){return["image/photoshop","image/x-photoshop","image/psd"]}}),N.register(class extends N{can_validate(e){return e.length>4}is_of_file_type(e){const t=e.readUInt16LE(0),r=e.readUInt16LE(2);return 0===t&&(1===r||2===r)}get_extensions(){return[".ico",".cur"]}get_mimes(){return["image/x-icon"]}});var ye=r(816).Buffer;N.register(class extends ${get_magic(){return ye.from([73,73,42,0])}get_extensions(){return[".tif",".tiff"]}get_mimes(){return["image/tiff","image/tiff-fx"]}});class ke extends N{get_type_tag(){throw new Error("Not Implemented!")}can_validate(e){return e.length>12}is_of_file_type(e){const t=e.readUInt32BE(0),r=e.readUInt32BE(8);return 1380533830===t&&r===this.get_type_tag()}}N.register(class extends ke{get_type_tag(){return 1464156752}get_extensions(){return[".webp"]}get_mimes(){return["image/webp"]}});class Ue extends N{get_root_element(){throw new Error("Not Implemented!")}is_of_file_type(e){return e.slice(0,512).toString().toLowerCase().includes("<"+this.get_root_element())}can_validate(e){return!0}}N.register(class extends Ue{get_root_element(){return"svg"}get_extensions(){return[".svg"]}get_mimes(){return["image/svg+xml"]}}),N.register(class extends Ue{get_root_element(){return"html"}get_extensions(){return[".html",".htm",".xhtml"]}get_mimes(){return["text/html","application/xhtml+xml"]}});var Be=r(816).Buffer;class Ie extends Error{}class Ee extends z.EventEmitter{constructor(e){super(),this.finder=e,this.disable_color=!1}calculate_optimial_size(e,t){return e.width*e.height*e.frames*t}describe_file(e){return"File properties: "+e.width+"x"+e.height+(1!==e.frames?", "+e.frames+" frames":"")}get_info(e,t,r,s){return new Promise(((n,i)=>{const o=e.extension.toLowerCase();let a=N.from_extension(o),l=null,c=!1;if(t instanceof Be){if(l=t,a?c=a.is_of_file_type(l):r.warn('There is no information provider for "'+o+'" files.'),!a||!c){!0===s.mismatch?r.info("This file is not what it seems, attempting brute force discovery of file type."):r.info("This file is not what it seems."),a=null;for(const e of N.all_providers())e.can_validate(l)&&e.is_of_file_type(l)&&(a=e)}if(!c){let e="unknown";a&&(e=a.get_extension()),!0===s.mismatch&&r.warn("There is a mismatch between the file extension ("+o+") and the file contents ("+e+")")}if(a){const e=a.get_info_provider();e?n((new e).get_info(l)):i(new Ie("Unsupported file type"))}else i(new Ie("Unknown file type"))}else i(new Ie("Image buffer is missing, this is a bug."))}))}lint(e,t){const r=new C,s=new G;let n=null;if(t.color_space){const e=t.color_space;n=new Set;for(let t of e)t=D.from(t),t&&n.add(t)}return r.on("next",((e,i)=>{const o=F.get_logger(e.path);function a(e){e instanceof Ie?o.error(e.message):e.stack?o.error(e.message+": "+e.stack):o.error(e)}e.loader.load().then((n=>{if(!r.is_stopped()){if(0===n.length)throw new Ie("This is an empty file, further analysis is not possible.");if(!0===t.duplicate){const t=s.contains(e.path,n);t&&o.warn("This file is a duplicate of: "+t)}return this.get_info(e,n,o,t)}})).then((e=>{if(!r.is_stopped())if(e.truncated)o.error("This image is truncated, further analysis is not possible.");else{const r=e.pixel_format.color_space,s=t.bytes_per_pixel,i=t.byte_savings,a=e.size-this.calculate_optimial_size(e.dimensions,s);if(o.info(this.describe_file(e.dimensions)),e.bytes_per_pixel>=s&&a>i&&(o.warn("The bytes per pixel ("+e.bytes_per_pixel.toFixed(2)+") exceeds the minimum ("+s+")."),o.info("You can acheive a minimum savings of "+a+" bytes by meeting this threshold.")),n)if("UNK"===r.name){const e=r.channels>0?r.channels:"an unknown number of";o.error(`This image has an unknown color space ${r.getUnkFormat()} with ${e} channels.`)}else n.size&&!n.has(r)&&o.warn(`The color space of this image is ${r.name}. It must be one of ${t.color_space}.`)}}),a).catch(a).finally((()=>{t.max_warnings>=0&&F.get_warning_count()>t.max_warnings&&(r.is_stopped()||(o.error(`Too many warnings. A maximum of ${t.max_warnings} warnings are allowed.`),r.stop())),this.emit("file.completed",o),i()}))})),r.on("end",(()=>{this.emit("linter.completed")})),r.start(this.finder.get_files(e)),this}}const ze={bytes_per_pixel:3,byte_savings:500,color_space:"G,RGB",mismatch:!0,duplicate:!0,max_warnings:-1};var Ce=r(816).Buffer;class Se extends class{constructor(e){this._path=e}getPath(){return this._path}load(){return Promise.reject(new Error("Not Implemented!"))}}{constructor(e){super(""),this._blob=e}async load(){const e=await this._blob.arrayBuffer();return Ce.from(e)}}var Ge=r(7425);const De=JSON.parse('{"u2":"image-lint","i8":"3.0.0","WL":"Find files that are incorrectly named or compressed."}'),Me={components:{GithubButton:E.Z},data(){const e=Object.assign({},ze);return e.color_space=e.color_space.split(","),{name:De.u2,version:De.i8,description:De.WL,support:{},available:{color_space:["G","RGB","CMYK","YCbCr","YCCK","LAB","HSV"]},option:e,files:[]}},methods:{clear:function(){this.files.length=0}}};var Re=r(6959);const Ye=(0,Re.Z)(Me,[["render",function(e,t,r,n,E,z){const C=(0,i.up)("github-button"),S=(0,i.up)("vue-multiselect"),G=(0,i.up)("iml-image-collection"),D=(0,i.up)("iml-dropzone");return(0,i.wg)(),(0,i.iD)("div",null,[(0,i._)("header",a,[(0,i._)("h1",l,(0,o.zw)(E.name),1),(0,i._)("span",c,"v"+(0,o.zw)(E.version),1),(0,i._)("h2",h,(0,o.zw)(E.description),1),(0,i.Wm)(C,{class:"github-button",href:"https://github.com/aaronasachimp/image-lint","data-size":"large","data-show-count":"true","aria-label":"Star aaronasachimp/image-lint on GitHub"},{default:(0,i.w5)((()=>[_])),_:1})]),(0,i._)("form",u,[(0,i._)("div",d,[m,(0,i._)("label",p,[(0,i.wy)((0,i._)("input",{"onUpdate:modelValue":t[0]||(t[0]=e=>E.option.mismatch=e),type:"checkbox"},null,512),[[s.e8,E.option.mismatch]]),f]),(0,i._)("label",g,[(0,i.wy)((0,i._)("input",{"onUpdate:modelValue":t[1]||(t[1]=e=>E.option.duplicate=e),type:"checkbox"},null,512),[[s.e8,E.option.duplicate]]),w]),(0,i._)("label",b,[x,(0,i.wy)((0,i._)("input",{"onUpdate:modelValue":t[2]||(t[2]=e=>E.option.bytes_per_pixel=e),type:"number",step:"0.1",min:"0"},null,512),[[s.nr,E.option.bytes_per_pixel]])]),(0,i._)("label",v,[y,(0,i.wy)((0,i._)("input",{"onUpdate:modelValue":t[3]||(t[3]=e=>E.option.byte_savings=e),type:"number",min:"0"},null,512),[[s.nr,E.option.byte_savings]])]),(0,i._)("label",k,[U,(0,i.Wm)(S,{modelValue:E.option.color_space,"onUpdate:modelValue":t[4]||(t[4]=e=>E.option.color_space=e),multiple:!0,options:E.available.color_space},null,8,["modelValue","options"])])]),(0,i._)("div",B,[(0,i.Wm)(D,{modelValue:E.files,"onUpdate:modelValue":t[6]||(t[6]=e=>E.files=e),class:(0,o.C_)({empty:0==E.files.length})},{default:(0,i.w5)((()=>[E.files.length?((0,i.wg)(),(0,i.iD)("div",I,[(0,i._)("button",{type:"button",onClick:t[5]||(t[5]=(...t)=>e.clear&&e.clear(...t))}," Clear Results "),(0,i.Wm)(G,{options:E.option,files:E.files},null,8,["options","files"])])):(0,i.kq)("",!0)])),_:1},8,["modelValue","class"])])])])}]]),Fe={class:"lint-results"},Ne={open:""},Ve={key:0},$e=(0,i.Uk)(" - "),Le={key:0},qe={key:0},Ae={key:1},Te={key:0},je={key:2},Oe=["innerHTML"],Ke=new class extends class{constructor(e,t){this.extensions=e,this.mimes=t}get_files(e){throw new Error("Not Implemented")}is_image_extension(e){return this.extensions.indexOf(e)>=0}is_image_mime(e){return this.mimes.indexOf(e)>=0}}{get_files(e){return Promise.resolve(this._search.bind(this,e))}*_search(e){for(const t of e){const e=Ge.extname(t.name);yield{path:t.name,extension:e,loader:new Se(t)}}}}(N.get_all_extensions(),N.get_all_mimes()),Pe={props:{options:{type:Object,required:!0},files:{type:Array,required:!0}},data:()=>({linter:null,error:null,results:null}),computed:{has_finished(){return null!==this.results||null!==this.error},has_error(){return null!==this.error},has_results(){return null!==this.results}},watch:{files:{async handler(e,t){const r=this.options,s=new Ee(Ke);let n=null;try{n=await new Promise(((t,n)=>{const i=[];s.lint(e,r).on("file.completed",(e=>{i.push(e)})).on("linter.completed",(()=>{t(i)}))}))}catch(e){return void(this.error=e)}this.results=n},immediate:!0}},methods:{reformat_log:e=>e.trim().split("\n").map((e=>e.trim())).join("\n")}},We=(0,Re.Z)(Pe,[["render",function(e,t,r,s,n,a){return(0,i.wg)(),(0,i.iD)("ul",Fe,[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(n.results,(t=>((0,i.wg)(),(0,i.iD)("li",{key:t.filename,class:(0,o.C_)(["lint-result",{"has-error":e.has_error,"has-results":e.has_results}])},[(0,i._)("details",Ne,[(0,i._)("summary",{class:(0,o.C_)(["lint-result-summary",{"lint-error":t&&t.count.error,"lint-warn":t&&t.count.warn}])},[(0,i.Uk)((0,o.zw)(t.filename)+" ",1),e.has_results?((0,i.wg)(),(0,i.iD)("span",Ve,[$e,t.count.info?((0,i.wg)(),(0,i.iD)("span",Le,[(0,i.Uk)(" Info: "+(0,o.zw)(t.count.info),1),t.count.warn||t.count.error?((0,i.wg)(),(0,i.iD)("span",qe,", ")):(0,i.kq)("",!0)])):(0,i.kq)("",!0),t.count.warn?((0,i.wg)(),(0,i.iD)("span",Ae,[(0,i.Uk)(" Warnings: "+(0,o.zw)(t.count.warn),1),t.count.error?((0,i.wg)(),(0,i.iD)("span",Te,", ")):(0,i.kq)("",!0)])):(0,i.kq)("",!0),t.count.error?((0,i.wg)(),(0,i.iD)("span",je,"Errors: "+(0,o.zw)(t.count.error),1)):(0,i.kq)("",!0)])):(0,i.kq)("",!0)],2),e.has_results?((0,i.wg)(),(0,i.iD)("output",{key:0,class:"lint-result-output",innerHTML:e.reformat_log(t.log)},null,8,Oe)):(0,i.kq)("",!0)])],2)))),128))])}]]),Ze=(0,i.Uk)("Drop files here"),He={props:{modelValue:{type:Array,required:!0}},emits:["update:modelValue"],methods:{files:function*(e){if(e.items)for(const t of e.items)yield t.getAsFile();else yield*e.files},drop:function(e){e.preventDefault(),this.$refs.dropzone.classList.remove("active");const t=Array.from(this.files(e.dataTransfer));this.$emit("update:modelValue",t)},dragenter:function(){this.$refs.dropzone.classList.add("active")},dragleave:function(){this.$refs.dropzone.classList.remove("active")},dragover:function(e){e.preventDefault()}}},Xe=(0,Re.Z)(He,[["render",function(e,t,r,s,n,o){return(0,i.wg)(),(0,i.iD)("div",{ref:"dropzone",class:"drop-target",onDrop:t[0]||(t[0]=(...t)=>e.drop&&e.drop(...t)),onDragover:t[1]||(t[1]=(...t)=>e.dragover&&e.dragover(...t)),onDragenter:t[2]||(t[2]=(...t)=>e.dragenter&&e.dragenter(...t)),onDragleave:t[3]||(t[3]=(...t)=>e.dragleave&&e.dragleave(...t))},[(0,i.WI)(e.$slots,"default",{},(()=>[Ze]))],544)}]]),Je=document.body,Qe=document.createElement("div");Je.appendChild(Qe),(0,s.ri)(Ye).component("vue-multiselect",n.ZP).component("image-lint-app",Ye).component("iml-image-collection",We).component("iml-dropzone",Xe).mount(Qe)},2909:()=>{},5545:()=>{},6047:()=>{},6611:()=>{},1212:()=>{},303:()=>{},7523:()=>{},4282:()=>{},471:()=>{},1632:()=>{}},e=>{e.O(0,[216],(()=>(5292,e(e.s=5292)))),e.O()}]);
//# sourceMappingURL=main.a4263d76398099da99a6.js.map